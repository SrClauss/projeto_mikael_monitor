import { Button, Input, Space } from "antd"
import { useState, useEffect } from "react"
import { CheckOutlined } from "@ant-design/icons"
export default function Consultor({ consultor, fase, estado, enviaConsultor, key }) {
    const [estadoConsultor, setEstadoConsultor] = useState(estado)
    const [consultorInput, setConsultorInput] = useState(consultor)


    if (!consultor && fase === "06 - FINANCIAMENTO") {
        if (estadoConsultor === 0) {
            return (

                <Button className="bg-cyan-600" type="primary" onClick={() => setEstadoConsultor(1)}>
                    Inserir Consultor
                </Button>
            )
        }
        else if (estadoConsultor === 1) {
            return (
                <Space.Compact>
                    <Input
                        onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                        onChange={e => setConsultorInput(e.target.value)} placeholder="Consultor" />
                    <Button type="primary"
                        className="bg-cyan-600"

                        icon={<CheckOutlined />}
                        onClick={() => {


                            enviaConsultor(consultorInput)

                        }


                        } />


                </Space.Compact>

            )
        }
        else {
            return (<div>
              
            </div>)
        }

    }
    else {
        return (<div>{consultor}</div>)
    }
}