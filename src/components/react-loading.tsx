import ReactLoading from 'react-loading';
import React from 'react'

const ReactLoader = (props:any) => {
    const { color= '#1657ff' } = props;
    return <ReactLoading type={'spin'} color={color} height={'20px'} width={'20px'} />
}

export default ReactLoader