import React, { useState, useTransition } from "react";
import { Chart, GoogleVizEventName, ReactGoogleChartEvent } from "react-google-charts";
import ReactLoader from "./react-loading";
import Modal from "react-modal";
import { toast } from "sonner";
import { HexColorPicker } from "react-colorful";
import { useParams } from "next/navigation";
import { addTimeframe, deleteTimeframe, updateTimeframe } from "@/services/admin/admin-service";
import { useSession } from "next-auth/react";


export default function TimeframeEditor(props: any) {
    const { project, mutate } = props
    const options = {
        height: (project?.timeframe?.length ?? 0) * 80,
        gantt: {
            trackHeight: 50,
            criticalPathEnabled: true,
            criticalPathStyle: {
                stroke: '#e64a19',
            },
            innerGridTrack: {
                fill: 'white'
            },
            innerGridDarkTrack: {
                fill: '#e6e6e6'
            },
            barCornerRadius: 5,
            barHeight: 30,
            labelStyle: {
                fontName: 'Arial',
                fontSize: 12,
                color: '#333',
            },
        }
    }
    const session = useSession()
    const role = (session as any)?.data?.user?.role
    const isClient = role === 'user'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [formState, setFormState] = useState({ name: '', progress: '', startDate: '', endDate: '' });
    const [isPending, startTransition] = useTransition();
    const projectId = useParams().id;

    const columns = [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "string", label: "Resource" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" },
        { type: "string", label: "Color", role: "style" }, // Add this line
    ];

    const rowsOfTimeframe = (project?.timeframe ?? []).map((timeframe: any) => {
        return [
            timeframe._id,
            timeframe.name,
            Math.random().toString(36).substring(7),
            new Date(timeframe.startDate),
            new Date(timeframe.endDate),
            null,
            timeframe.progress,
            null,
            timeframe.color // Ensure this is the correct property for the color
        ];
    });

    const data = [columns, ...rowsOfTimeframe];

    const handleChartClick = (chartWrapper: any) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length > 0) {
            const [selectedItem] = selection;
            const task = data[selectedItem.row + 1];
            const color = project?.timeframe.find((timeframe: any) => timeframe._id === task[0])?.color;
            const taskWithColor = [...task, color];
            setFormState({
                name: task[1],
                progress: task[6] || '',
                startDate: new Date(task[3]).toISOString().split('T')[0],
                endDate: new Date(task[4]).toISOString().split('T')[0],
            });
            setSelectedTask(taskWithColor);
        } else {
            setSelectedTask(null);
            setFormState({
                name: '',
                progress: '',
                startDate: '',
                endDate: ''
            });
        }
        setIsModalOpen(true);
    };

    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "select" as GoogleVizEventName,
            callback: ({ chartWrapper }: any) => handleChartClick(chartWrapper),
        }
    ];

    if (!project) return <ReactLoader />;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        let flag = 1
        const payload = {
            ...formState,
            projectId,
        }
        for (const i of project.timeframe) {
            if (i.name === payload.name && selectedTask && i._id !== selectedTask[0]) {
                toast.error('Navnet på milepælen skal være unikt', { position: 'top-right', });
                return;
            }
        }
        if (flag === 0) return
        if (new Date(payload.startDate) > new Date(payload.endDate)) {
            toast.error('Startdatoen kan ikke være efter slutdatoen', { position: 'top-right', })
            return;
        }
        startTransition(async () => {
            try {
                const response = !selectedTask ?
                    await addTimeframe('/admin/project-timeframe', payload)
                    :
                    await updateTimeframe(`/admin/project-timeframe/${selectedTask[0]}`, payload)
                toast.success(response.data.message, { position: 'top-right' });
                mutate()
                setIsModalOpen(false)
            } catch (error: any) {
                if (error.status === 400) {
                    alert(error.response.data.message);
                }
                toast.error('Something went wrong, please try again later', { position: 'top-right', });
            }
        });
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleDelete = async () => {
        if (!selectedTask) return
        startTransition(async () => {
            try {
                await deleteTimeframe(`/admin/project-timeframe/${selectedTask[0]}`, { data: { projectId } });
                toast.success('Tidsrammen blev slettet', { position: 'top-right' });
                mutate();
                setIsModalOpen(false);
            } catch (error: any) {
                toast.error('Kunne ikke slette tidsrammen', { position: 'top-right' });
            }
        })
    };

    return (
        <div className="w-full text-right">
            {!isClient && <div className="w-full flex justify-end">
                <button
                    onClick={() => {
                        setSelectedTask(null);
                        setIsModalOpen(true);
                        setFormState({
                            name: '',
                            progress: '',
                            startDate: '',
                            endDate: ''
                        });
                    }}
                    className="flex justify-end px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 my-4"
                >
                    + Tilføj til tidsramme
                </button>
            </div>}

            {(project.timeframe ?? []).length > 0 && <Chart
                chartType="Gantt"
                width="100%"
                height="100%"
                data={data}
                options={options}
                chartEvents={!isClient ? chartEvents:  undefined}
                className="w-full h-full"
            />}
            {isModalOpen && <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Edit Client Details"
                className="modal max-w-[360px] outline-none border-none mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
                overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                ariaHideApp={false}>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">{selectedTask ? "Rediger tidsramme" : "Tilføj tidsramme"}</h2>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium">Opgavens navn:</label>
                            <input
                                type="text"
                                name="name"
                                value={formState.name}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        {/* <div className="space-y-2">
                            <label className="mb-2 font-medium">Farve:</label>
                            <div className="flex gap-3 items-end">
                                <HexColorPicker color={formState.color} onChange={(color) => setFormState(prevState => ({ ...prevState, color }))} className="h-20" />
                                {formState.color && <div className="font-bold">
                                    {formState.color}
                                </div>}
                            </div>
                        </div> */}
                        {/* add  a progress field a number */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium">Fremskridt (%):</label>
                            <input
                                type="number"
                                name="progress"
                                value={formState.progress}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded"
                                min="0"
                                max="100"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium">Startdato:</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formState.startDate}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium">Slutdato:</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formState.endDate}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                        </div>
                        {!isPending ? <button disabled={isPending} type="submit" className="px-4 py-2 bg-[#1657ff] text-white rounded hover:bg-blue-600">
                            Gem
                        </button>
                            :
                            <div className="flex justify-center">
                                <ReactLoader color='#1657ff' />
                            </div>}
                        {selectedTask && <button type="button" disabled={isPending} onClick={handleDelete} className={`${isPending ? 'bg-red-400' : 'bg-red-600'}  text-white p-2 rounded-md`}>Slet</button>}
                    </form>
                </div>
            </Modal>}
        </div>
    );
}