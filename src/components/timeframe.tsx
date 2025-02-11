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
    const { project, mutate } = props;
    
    // Timeline chart options. Note: removed the gantt-related settings.
    const options = {
        height: (project?.timeframe?.length ?? 0) * 90,
        allowHtml: true,
        timeline: {
            barCornerRadius: 10,
        },
         backgroundColor: 'white'
    };

    const session = useSession();
    const role = (session as any)?.data?.user?.role;
    const isClient = role === 'user';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [formState, setFormState] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });
    const [isPending, startTransition] = useTransition();
    const projectId = useParams().id;

    // Define columns for timeline
    const columns = [
        { type: "string", label: "Task Name" },
        { type: "string", label: "Label" },
        { type: "string", role: "tooltip" },
        { type: "date", label: "Start" },
        { type: "date", label: "End" },
    ];

    // Build rows from project.timeframe.
    const rowsOfTimeframe = (project?.timeframe ?? []).map((timeframe: any) => {
        return [
            timeframe.name,
            timeframe.name,
            '',
            new Date(timeframe.startDate),
            new Date(timeframe.endDate),
        ];
    });

    const data = [columns, ...rowsOfTimeframe];

    // Updated event handler that uses the project.timeframe array instead of the built data table.
    const handleChartClick = (chartWrapper: any) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length > 0) {
            const [selectedItem] = selection;
            const selectedIndex = selectedItem.row;
            const task = project.timeframe[selectedIndex];
            setFormState({
                name: task.name,
                startDate: new Date(task.startDate).toISOString().split('T')[0],
                endDate: new Date(task.endDate).toISOString().split('T')[0],
            });
            setSelectedTask(task);
        } else {
            setSelectedTask(null);
            setFormState({
                name: '',
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
        const payload = {
            ...formState,
            projectId,
        };

        for (const i of project.timeframe) {
            if (i.name === payload.name && selectedTask && i._id !== selectedTask._id) {
                toast.error('Navnet på milepælen skal være unikt', { position: 'top-right' });
                return;
            }
        }
        if (new Date(payload.startDate) > new Date(payload.endDate)) {
            toast.error('Startdatoen kan ikke være efter slutdatoen', { position: 'top-right' });
            return;
        }
        startTransition(async () => {
            try {
                const response = !selectedTask
                    ? await addTimeframe('/admin/project-timeframe', payload)
                    : await updateTimeframe(`/admin/project-timeframe/${selectedTask._id}`, payload);
                toast.success('Tidsramme blev føjet til projektet', { position: 'top-right' });
                mutate();
                setIsModalOpen(false);
            } catch (error: any) {
                if (error.status === 400) {
                    alert(error.response.data.message);
                }
                toast.error('Something went wrong, please try again later', { position: 'top-right' });
            }
        });
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDelete = async () => {
        if (!selectedTask) return;
        startTransition(async () => {
            try {
                await deleteTimeframe(`/admin/project-timeframe/${selectedTask._id}`, { data: { projectId } });
                toast.success('Tidsrammen blev slettet', { position: 'top-right' });
                mutate();
                setIsModalOpen(false);
            } catch (error: any) {
                toast.error('Kunne ikke slette tidsrammen', { position: 'top-right' });
            }
        });
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
                chartType="Timeline"
                width="100%"
                height="100%"
                data={data}
                options={options}
                chartEvents={!isClient ? chartEvents : undefined}
                className="w-full h-full"
            />}
            {isModalOpen && <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Edit Client Details"
                className="modal max-w-[360px] outline-none border-none mx-auto rounded-[20px] w-full max-h-[90vh] overflow-auto overflow-custom"
                overlayClassName="w-full h-full p-3 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                ariaHideApp={false}>
                <div className="bg-white p-6 rounded-lg shadow-lg relative">
                    <div className="absolute top-2 right-4">
                        <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold text-gray-500">&times;</button>
                    </div>
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