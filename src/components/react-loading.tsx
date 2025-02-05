import ReactLoading from 'react-loading';
import React from 'react'

const ReactLoader = (props:any) => {
    const { color= '#f4f5f7' } = props;
    return <ReactLoading type={'spin'} color={color} height={'20px'} width={'20px'} />
}

export default ReactLoader