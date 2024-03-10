import { ArrowLeftOutlined, BugTwoTone, DeleteOutlined, DeleteRowOutlined, FolderOpenFilled, PlusOutlined } from "@ant-design/icons";
import { dialog, invoke } from "@tauri-apps/api";
import { FloatButton, Space, Input, Button, Form, Tooltip, Table } from "antd";
import { appDataDir, appLocalDataDir } from "@tauri-apps/api/path";
import { fs } from "@tauri-apps/api";
import { useState } from "react";
import { stringify } from "postcss";


const brufs = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"]



export default function ConfigForm({ setShowConfig, config, onSubmit }) {
    const [baseFolder, setBaseFolder] = useState(config.BASE_FOLDER || "")
    const [responsaveis, setResponsaveis] = useState(config.RESPONSAVEIS ? config.RESPONSAVEIS.map((r, i) => { return { key: i, responsavel: r } }) : [])
    const [responsavelNome, setResponsavelNome] = useState("")


    const editConfig = () => {
        appLocalDataDir().then(async (path) => {
            if (baseFolder) {
                fs.writeTextFile(path + "/config.json",
                    JSON.stringify({
                        BASE_FOLDER: baseFolder,
                        RESPONSAVEIS: responsaveis.map(r => r.responsavel),
                        BRUFS: brufs
                    })).then(() => {
                        onSubmit({
                            BASE_FOLDER: baseFolder,
                            RESPONSAVEIS: responsaveis.map(r => r.responsavel),
                            BRUFS: brufs
                        })
                        setShowConfig(false)
                        invoke("create_folders_sctructure", { path: baseFolder }).then(() => {
                            console.log("Pastas OK")

                        }).catch((error) => {
                            dialog.message(error, { title: "Erro ao criar pastas", type: "error" })
                        })
                    }).catch(error => dialog.message(error, { title: "Erro ao editar config", type: "error" }))


            }
            else {
                dialog.message("É obrigatório indicar um diretorio base")
            }
        })

    }

    const handleBaseFolderButtonClick = async () => {
        const folder = await dialog.open({
            defaultPath: "C:/",
            directory: true,
            multiple: false,

        })
        setBaseFolder(folder)


    }
    const handlerAddResponsavelButtonClick = () => {
        if (responsavelNome !== "") {


            setResponsaveis([...responsaveis, {
                key: responsaveis.length,
                responsavel: responsavelNome,




            }])
            setResponsavelNome("")
        }
    }



    const handlerExcluirResponsavelButtonClick = (index) => {
        setResponsaveis(() => {
            const copy = [...responsaveis]
            copy.splice(index, 1)
            return copy
        })
    }

    const columns = [
        {
            title: 'Responsavel',
            dataIndex: 'responsavel',
            key: 'responsavel',
        },
        {
            title: 'Excluir',
            dataIndex: 'excluir',
            key: 'excluir',
            render: (_, record) => (
                <Button onClick={() => handlerExcluirResponsavelButtonClick(record.key)} icon={<DeleteOutlined />} />
            )
        }

    ]

    return (
        <div>

            <div className="text-3xl p-3 bg-blue-500 text-white text-center font-weight-bold">Configurações</div>



            <Form className="mt-24" layout="vertical">
                <Form.Item label="Pasta de Projetos">

                    <Space.Compact style={{ width: '100%' }}>
                        <Input disabled value={baseFolder} placeholder="Diretorio de Projetos" />
                        <Tooltip title="Abrir pasta de projetos">
                            <Button onClick={handleBaseFolderButtonClick} icon={<FolderOpenFilled />} className="bg-black" type="primary" />
                        </Tooltip>
                    </Space.Compact>

                </Form.Item>

                <Form.Item label="Adcionar Responsavel">

                    <Space.Compact style={{ width: '100%' }}>
                        <Input

                            value={responsavelNome}
                            placeholder="Responsável"
                            onChange={(e) => {

                                setResponsavelNome(e.target.value)

                            }}
                            onInput={(e) => e.target.value = e.target.value.toUpperCase()} />
                        <Tooltip title="Adcionar Responsavel">
                            <Button onClick={handlerAddResponsavelButtonClick} icon={<PlusOutlined />} className="bg-blue-500" type="primary" />
                        </Tooltip>
                    </Space.Compact>



                </Form.Item>
                <Table columns={columns} dataSource={responsaveis} />
                <Button className="bg-blue-500 w-full text-white " onClick={() => editConfig(baseFolder, responsaveis, brufs)}>Salvar</Button>




            </Form>

            <FloatButton
                icon={<ArrowLeftOutlined />}
                style={{ top: 85 }}
                onClick={() => setShowConfig(false)}
            />


        </div>

    )
}