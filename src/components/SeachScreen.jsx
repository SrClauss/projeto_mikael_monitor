import { Select, Radio, Divider, FloatButton, Table } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";

export default function SeachScreen({ columns, filtredValues, setShowForm, onFilterSet, onSetCustomer, setConfigForm }) {

  



  const radioOptions = [
    {
      label: "Todos",
      value: "TODOS",
    },
    {
      label: "Projeto",
      value: "01 - PROJETO",
    },
    {
      label: "Digitação",
      value: "02 - DIGITACAO",
    },
    {
      label: "Revisão",
      value: "03 - REVISAO",
    },
    {
      label: "Conferência", 
      value: "04 - CONFERENCIA",
    },
    {
      label: "Negociação",
      value: "05 - NEGOCIACAO",

    },
    {
      label: "Financiamento",
      value: "06 - FINANCIAMENTO",
    },
    {
      label: "Fechado",
      value: "07 - FECHADO",
    }    
  ]



  return (
    <div>
      <div id="processos">
        <div className="flex justify-between">

        <Search
          placeholder="Pesquisar por cliente"
          enterButton
          allowClear
          className="bg-blue-500 mr-2"
          onSearch={(value) => onSetCustomer(value)}    
          onInput={(e) => e.target.value = e.target.value.toUpperCase()}/>
                  
        </div>

        <Divider orientation="left">Fases</Divider>

        <div className="flex justify-center">

          <Radio.Group 
          options={radioOptions}
          onChange={(e) => onFilterSet(e.target.value)}
          optionType="button"
          buttonStyle="solid"
           defaultValue="TODOS" />
        </div>
        <Divider />
        <div>
          <Table columns={columns} dataSource={filtredValues} />

        </div>
        <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          aria-label="Adcionar Processo"
          tooltip="Adcionar Processo"
          onClick={() => setShowForm(false)} />
          <FloatButton
        icon={<SettingOutlined />}
        style={{ right: "82px" }}
        aria-label="Configurações"
        tooltip="Configurações"
        onClick={() => setConfigForm(true)} />
        



      </div>

    </div>
  )
}