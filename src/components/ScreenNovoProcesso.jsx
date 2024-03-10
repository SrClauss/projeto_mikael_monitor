import { invoke } from "@tauri-apps/api"
import { Button, DatePicker, FloatButton, Form, Input, Select, Space, Tooltip } from "antd"
import { useEffect, useState } from "react"
import ScreenCustomerForm from "./ScreenCustomerForm"
import { ArrowLeftOutlined, PlusOutlined  } from "@ant-design/icons"

export default function ScreenNovoProcesso({ setShowForm, config, readAllProjects,  }) {
    const [showCustomerForm, setShowCustomerForm] = useState(false)
    const [customers, setCustomers] = useState([])
    const [customerSelected, setCustomerSelected] = useState({})
    const [responsavelSelected, setResponsavelSelected] = useState()
    const [dateSelected, setDateSelected] = useState()
    const [faseSelected, setFaseSelected] = useState("01 - PROJETO")
    const [descricao, setDescricao] = useState("")
    const dateFormat = "DD/MM/YYYY";

    const refreshCustomers = () => {
        invoke("read_all_custommers", { path: config.BASE_FOLDER }).then((data) => {

            setCustomers(data)


        })
    }
    useEffect(() => {
        refreshCustomers()

    }, [])
    const handleAdcionarCliente = () => {
        setShowCustomerForm(true)
    }
    const handleSaveProject = () => {
        if (!responsavelSelected || !customerSelected || !dateSelected || !faseSelected) {
            alert("Preencha todos os campos")
        }
        else {
            const metadata = {
                responsavel: responsavelSelected,
                cliente: JSON.parse(customerSelected),
                descricao: descricao,
                dataCriacao: dateSelected,
                fase: faseSelected,
                consultor: "",
                erro: false
            }

            const nome_projeto = (JSON.parse(customerSelected).nome + "-" + descricao).replaceAll(" ", "_").toUpperCase()
            invoke("add_project", {
                path: config.BASE_FOLDER,
                projectName: nome_projeto,
                metadata: JSON.stringify(metadata),
                fase: faseSelected
            }).then((response) => {
                if (response == "Já existe um projeto com esse mesmo nome") {
                    
                    alert(response)
                }
                else{
                    setShowForm(false)
                    readAllProjects()
                }
            }).catch((error) => {
                alert(error)
            }
            )

        }
     


    }

    return (
        <div>
            {showCustomerForm ? <ScreenCustomerForm setCustomerForm={() => setShowCustomerForm(false)} config={config} onSubmit={refreshCustomers} /> :
                (
                    <>

                        <div className="bg-blue-500 text-white text-center py-2 text-2xl">Cadastrar Novo Processo</div>
                        <FloatButton style={{top: 85}} icon={<ArrowLeftOutlined />} onClick={() => setShowForm(false)} />
                        <Form layout="vertical" className="p-4 mt-10">
                            <Form.Item label="Responsável" id="responsavel">
                                <Select
                                    onSelect={(value) => setResponsavelSelected(value)}
                                    options={config.RESPONSAVEIS.map((responsavel) => ({ label: responsavel, value: responsavel }))}
                                    showSearch
                                />
                            </Form.Item>

                            <Form.Item label="Cliente">
                                <Space.Compact style={{ width: "100%" }}>

                                    <Select
                                        options={customers.map((customer) => ({ label: JSON.parse(customer).nome, value: customer }))}
                                        onSelect={(value) => setCustomerSelected(value)}
                                        onClear={() => setCustomerSelected(undefined)}
                                        allowClear
                                        showSearch
                                    />
                                    <Tooltip title="Adicionar novo cliente" placement="top" >
                                        <Button
                                            type="primary"
                                            className="bg-blue-500"
                                            onClick={handleAdcionarCliente}
                                            icon={<PlusOutlined/>}

                                        />
                                    </Tooltip>
                                </Space.Compact>
                            </Form.Item>
                            <Form.Item label="Descricão Curta">
                                <Input
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Descrição curta com até 15 caracteres"
                                    allowClear
                                    maxLength={15}

                                />
                            </Form.Item>

                            <Form.Item label="Data Criação">
                                <DatePicker
                                    onChange={(date, dateString) => setDateSelected(dateString)}
                                    format={dateFormat}
                            
                                     />
                            </Form.Item>
                            <Form.Item label="Fase">
                                <Select
                                    onSelect={(value) => setFaseSelected(value)}
                                    options={[
                                      { label: "Projeto", value: "01 - PROJETO" },
                                      { label: "Digitação", value: "02 - DIGITACAO" },
                                      { label: "Revisão", value: "03 - REVISAO" },
                                      { label: "Conferência", value: "04 - CONFERENCIA" },
                                      { label: "Negócioção", value: "05 - NEGOCIACAO" },
                                      { label: "Financiamento", value: "06 - FINANCIAMENTO" },
                                      { label: "Fechado", value: "07 - FECHADO" },

                                    ]}
                                    dropdownAlign={"center"}
                                    defaultValue={"01 - PROJETO"}

                                    
                                />
                            </Form.Item>
                            <Button onClick={handleSaveProject} className="bg-blue-500 w-full" type="primary">Salvar</Button>


                        </Form>
                    </>

                )

            }
        </div>
    )
}