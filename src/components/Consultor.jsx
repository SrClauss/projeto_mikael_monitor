import { Button, Input, Space } from "antd"


export default function Consultor({consultor, fase, estadoConsultor, gravaConsultor, key}){
    if (!consultor && fase === "06 - FINANCIAMENTO"){
        if (estadoConsultor === 0){
            return (
                
                <Button className="bg-cyan-600" type="primary" onClick={() => setEstadoConsultor(1)}>
                    Inserir Consultor
                </Button>
            )
        }
        else if (estadoConsultor === 1){
            return (
                <Space.Compact>
                    <Input placeholder="Consultor" />
                    <Button type="primary" onClick={() => gravaConsultor( key, consultor, 2)}>
                        Confirmar
                    </Button>
                </Space.Compact>
         
            )
        }
        else{
            return (<div>{consultor}</div>)
        }

    }
    else{
        return (<div>{consultor}</div>)
    }
}