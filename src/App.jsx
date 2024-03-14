import { useState, useEffect } from "react";
import "./App.css";
import { Button, Input, Space, Tooltip } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined, FolderOpenFilled, CheckOutlined } from "@ant-design/icons";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { dialog, fs } from "@tauri-apps/api";
import SeachScreen from "./components/SeachScreen";
import ScreenNovoProcesso from "./components/ScreenNovoProcesso";
import { invoke } from "@tauri-apps/api";
import ConfigForm from "./components/ConfigForm";
import Consultor from "./components/Consultor";


function App() {

  const [filteredValues, setFilteredValues] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [config, setConfig] = useState({})
  const [selectedFolder, setSelectedFolder] = useState("TODOS")
  const [customer, setCustomer] = useState("")
  const [configForm, setConfigForm] = useState(false)





  

  const navigateTo = (record) => {
    const folder = (config.BASE_FOLDER + "/" + record.fase + "/" + (record.cliente + "-" + record.descricao).replaceAll(" ", "_").toUpperCase()).replaceAll("/", "\\");

    invoke("goto_folder", { path: folder })
  }

  const handleConfigSubmit = (conf) => {
    setConfig(conf)
    readAllProjects()


  }



  const moveForward = async (register) => {
    const folders = [
      "01 - PROJETO",
      "02 - DIGITACAO",
      "03 - REVISAO",
      "04 - CONFERENCIA",
      "05 - NEGOCIACAO",
      "06 - FINANCIAMENTO",
      "07 - FECHADO",

    ]

    const currentFolder = register.fase
    const currentFolderIndex = folders.indexOf(currentFolder)
    const nextFolder = folders[currentFolderIndex + 1]
    const nome_projeto = (register.cliente + "-" + register.descricao).toUpperCase().replaceAll(" ", "_")


    if (nextFolder) {
      const ask = await confirm("Deseja mover o projeto para a pasta " + nextFolder + "?")
      if (ask) {
        invoke('move_path', {
          basepath: config.BASE_FOLDER,
          path: nome_projeto,
          origin: currentFolder,
          dest: nextFolder
        })
        await readAllProjects()



      }

    }

  }
  const moveBack = async (register) => {
    const folders = [
      "01 - PROJETO",
      "02 - DIGITACAO",
      "03 - REVISAO",
      "04 - CONFERENCIA",
      "05 - NEGOCIACAO",
      "06 - FINANCIAMENTO",
      "07 - FECHADO",

    ]

    const currentFolder = register.fase
    const currentFolderIndex = folders.indexOf(currentFolder)
    const previousFolder = currentFolderIndex > 0 ? folders[currentFolderIndex - 1] : folders[10000]
    const nome_projeto = (register.cliente + "-" + register.descricao).toUpperCase().replaceAll(" ", "_")


    if (previousFolder) {
      const ask = await confirm("Deseja mover o projeto para a pasta " + previousFolder + "?")
      if (ask) {
        invoke('move_path', {
          basepath: config.BASE_FOLDER,
          path: nome_projeto,
          origin: currentFolder,
          dest: previousFolder
        })
        await readAllProjects()




      }

    }

  }


  useEffect(() => {

    appLocalDataDir().then((path) => {
      appLocalDataDir().then((path) => {
        fs.exists(path + "config.json").then(async (exists) => {
          if (!exists) {
            setConfigForm(true)
            await dialog.message("Não existe arquivo de cofiguração para esta aplicação, configure o diretorio base e os responsáveis. Esta configuração poderá ser mudada posteriormente")

            
          }
          else {
            appLocalDataDir().then((path) => {
              fs.readTextFile(path + "config.json").then((data) => {
                if (!JSON.parse(data).BASE_FOLDER) {
                  setConfigForm(true)
                }
                else {
                  setConfig(JSON.parse(data))
                }
              })
            })

          }

        })


      })

      fs.readTextFile(path + "/config.json").then((data) => {
        const parsedData = JSON.parse(data)
        setConfig(parsedData)
       
       
        readAllProjects(parsedData)

      }


      ).catch((error) => {
        console.log(error)
      })
     

    })
  }, [selectedFolder, customer])


  const readAllProjects = async (conf = config) => {
    invoke("read_all_projects", { path: conf.BASE_FOLDER, fase: selectedFolder, customer: customer }).then((data) => {

      const jsonData = data.map(p => JSON.parse(p))
      setFilteredValues(() =>
        jsonData.map((project, index) => ({
          key: index,
          responsavel: project.responsavel,
          descricao: project.descricao,
          cliente: project.cliente.nome,
          dataCriacao: project.dataCriacao,
          fase: project.fase,
          consultor: project.consultor,
          metadata: project.cliente,
          estadoConsultor: 0,



        }))
      )




    }).catch((error) => {
      console.log(error)
    })
  }

  const gravaConsultor = async (record, newConsultor) => {
    const key = record.key
    console.log("consultor: " + newConsultor)
    const project_name = record.cliente + "-" + record.descricao
    invoke("insert_consultor", {path: config.BASE_FOLDER, consultor: newConsultor, project_name: project_name}).then((data) => {
      console.log(data)
    }).catch((error) => {
      console.log(error)
    })
    
  }
  

  const columns = [
    {
      title: "Responsável",
      dataIndex: "responsavel",
      width: "20%",
      key: "responsavel",
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      width: "20%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.cliente > b.cliente ? -1 : 1,
      filters: filteredValues.map((p) => ({ text: p.cliente, value: p.cliente })),
      onFilter: (value, record) => record.cliente.includes(value),

    },
    {
      title: "Descricão",
      dataIndex: "descricao",
      key: "descricao",
      width: "15%"
    },
    {
      title: "Data Criação",
      dataIndex: "dataCriacao",
      key: "dataCriacao",
      width: "5%"

    },
    {
      title: "Fase",
      dataIndex: "fase",
      key: "fase",
      width: "10%"
    },
    {
      title: "Consultor",
      dataIndex: "consultor",
      key: "consultor",
      width: "20%",
      render: (_, record) => (<Consultor 
        consultor={record.consultor} 
        fase={record.fase} 
        estado={record.estadoConsultor} 
        enviaConsultor={(consultor)=>{
          const project_name = (record.cliente + "-" + record.descricao).toUpperCase().replaceAll(" ", "_")
          invoke("insert_consultor", {path: config.BASE_FOLDER, consultor: consultor, projectName: project_name}).then((data) => {
            console.log(data)
          }).catch((error) => {
            console.log(error)
          })
          setFilteredValues(()=>{
            const copy = [...filteredValues]
            copy[record.key].consultor = consultor
            copy[record.key].estadoConsultor = 0
            return copy

          })


        }}
        />)
   
     
    },
    {
      title: "Ações",
      dataIndex: "acoes",
      key: "acoes",
      render: (_, record) => (
        <>

          <Tooltip title="Navegar ao diretorio do projeto">

            <Button className="mr-1" onClick={() => navigateTo(record)} icon={<FolderOpenFilled />} />


          </Tooltip>
          <Tooltip title="Regredir Projeto">
            <Button onClick={() => moveBack(record)} className="mr-1" icon={<DoubleLeftOutlined />} />
          </Tooltip>

          <Tooltip onClick={() => moveForward(record)} title="Avançar Projeto">
            <Button className="mr-1" icon={<DoubleRightOutlined />} />


          </Tooltip>



        </>


      )
    },


  ]

  return (


    <div className="p-4">
      {showForm ? (
        configForm ? (
          <ConfigForm setShowConfig={setConfigForm} config={config} onSubmit={handleConfigSubmit} />
        ) :

          <SeachScreen
            columns={columns}
            filtredValues={filteredValues}
            setShowForm={setShowForm}
            onFilterSet={setSelectedFolder}
            onSetCustomer={setCustomer}
            setConfigForm={setConfigForm}


          />) :
        (<ScreenNovoProcesso
          config={config}
          setShowForm={() => setShowForm(!showForm)}
          readAllProjects={readAllProjects} />)}




    </div>





  )
}



export default App;
