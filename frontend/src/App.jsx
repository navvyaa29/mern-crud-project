import { useState, useEffect } from "react";
import { Button, Image, Table, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined, EditFilled, DeleteFilled } from "@ant-design/icons";
import axios from "axios";
import useSwr, { mutate } from "swr";
import formConfig from "./formConfig.json";
import Dashboard from "./Dashboard";

axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
const [loginData, setLoginData] = useState({
  email: "",
  password: ""
});
const [token, setToken] = useState(localStorage.getItem("token") || "");
const [regForm] = Form.useForm();
const [modal, setModal] = useState(false);
const [imgUrl, setImgUrl] = useState(null);
const [id, setId] = useState(null);
 const [showDashboard, setShowDashboard] = useState(false);
const [disabled, setDisabled] = useState(false);

 const [dynamicOptions, setDynamicOptions] = useState({});
useEffect(() => {
    const fetchOptions = async () => {
      try {
        const genderRes = await axios.get("/options/gender");

        setDynamicOptions({
          gender: genderRes.data
        });

      } catch (err) {
        console.log("Error fetching dropdown:", err);
      }
    };

    fetchOptions();
  }, []);
const columns = [
{
title: "Profile",
dataIndex: "profile",
render: (_, obj) => (
<Image src={obj.profile} width={40} className="rounded-full" />
)
},
{ title: "Name", dataIndex: "fullname" },
{ title: "Email", dataIndex: "email" },
{ title: "Mobile", dataIndex: "mobile" },
{ title: "DOB", dataIndex: "dob" },
{ title: "Gender", dataIndex: "gender" },
{ title: "Address", dataIndex: "address" },
{
title: "Action",
render: (_, obj) => (
<>
<Button
className="text-green-500"
icon={<EditFilled />}
shape="circle"
type="text"
onClick={() => onEdit(obj)}
/>

<Button
className="text-rose-500"
icon={<DeleteFilled />}
shape="circle"
type="text"
onClick={() => onDelete(obj._id)}
/>
</>
)
}
];
const getAuthConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
};
const fetcher = async (url) => {
  try {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      return [];
    }

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    return data;
  } catch (err) {
    return [];
  }
};

const { data } = useSwr("/register", fetcher);

const dataSource = data && data.map(item => ({
...item,
key: item._id
}));

const handleImage = (e) => {
const file = e.target.files[0];
const reader = new FileReader();

if (file.size <= 60000) {
setDisabled(false);
reader.readAsDataURL(file);

reader.onload = (ev) => {
setImgUrl(ev.target.result);
};
} else {
setDisabled(true);
message.error("Image must be under 60KB");
}
};

const onDelete = async (id) => {
  try {
    await axios.delete(`/register/${id}`, getAuthConfig());
    message.success("Data deleted successfully!");
    mutate('/register');
  } catch (err) {
    message.error("Unable to delete data!");
  }
};

const onEdit = (obj) => {
delete obj.profile;
setModal(true);
regForm.setFieldsValue(obj);
setId(obj._id);
};

const onFinish = async (values) => {
  imgUrl
    ? values.profile = imgUrl
    : values.profile = 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png';

  console.log(values);

  try {
    await axios.post('/register', values, getAuthConfig());
    setModal(false);
    regForm.resetFields();
    setImgUrl(null);
    mutate('/register');
    message.success("Registration success!");
  } catch (err) {
    if (err?.response?.data?.error?.code === 11000) {
      return regForm.setFields([{ name: 'email', errors: ['Already exists!'] }]);
    }
    message.error("unable to insert data!");
  }
};
const onUpdate = async (values) => {
  imgUrl ? values.profile = imgUrl : delete values.profile;
  console.log(values);

  try {
    await axios.put(`/register/${id}`, values, getAuthConfig());
    setModal(false);
    regForm.resetFields();
    setImgUrl(null);
    setId(null);
    mutate('/register');
    message.success("Update success!");
  } catch (err) {
    message.error("unable to update data!");
  }
};

const onClose = () => {
setModal(false);
setId(null);
regForm.resetFields();
};

const onLogin = async () => {
  try {
    const res = await axios.post("/auth/login", loginData);
    const receivedToken = res.data.token;

    localStorage.setItem("token", receivedToken);
    setToken(receivedToken);

    await mutate("/register");

    message.success("Login successful!");
    console.log("TOKEN:", receivedToken);
  } catch (err) {
    message.error("Login failed!");
    console.log(err);
  }
};
const getProfile = async () => {
  try {
    const res = await axios.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("PROFILE DATA:", res.data);
    message.success("Profile fetched successfully!");
  } catch (err) {
    message.error("Unable to fetch profile!");
    console.log(err);
  }
};
const logoutUser = async () => {
  localStorage.removeItem("token");
  setToken("");

  await mutate("/register", [], false);

  message.success("Logged out successfully!");
};
return (

<div className="min-h-screen bg-rose-100 flex flex-col items-center md:p-4">
<div className="w-10/12 bg-white p-4 my-4 rounded">
  <h2 className="text-lg font-bold mb-3">Login</h2>

  <Input
    placeholder="Enter email"
    className="mb-2"
    value={loginData.email}
    onChange={(e) =>
      setLoginData({ ...loginData, email: e.target.value })
    }
  />

  <Input.Password
    placeholder="Enter password"
    className="mb-2"
    value={loginData.password}
    onChange={(e) =>
      setLoginData({ ...loginData, password: e.target.value })
    }
  />

  <div className="flex gap-2 mt-2">
  <Button type="primary" onClick={onLogin}>
    Login
  </Button>

  <Button onClick={getProfile}>
    Get Profile
  </Button>

  <Button danger onClick={logoutUser}>
    Logout
  </Button>
</div>
</div>
<div className="flex justify-between items-center bg-blue-600 w-10/12 my-5 p-4">
<div style={{ marginBottom: "20px" }}>
  <Button onClick={() => setShowDashboard(!showDashboard)}>
    {showDashboard ? "Back to Form" : "Go to Dashboard"}
  </Button>
</div>
<h1 className="text-white text-3xl font-bold">
MERN CRUD Operation
</h1>

<Button
shape="circle"
size="large"
className="bg-green-400 text-white"
icon={<PlusOutlined />}
onClick={() => setModal(true)}
/>

</div>

{showDashboard ? (
  <Dashboard />
) : (
  <>
    {/* EXISTING UI START */}

    <Table
      className="w-10/12"
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 5, position: ["bottomCenter"] }}
      scroll={{ x: "max-content" }}
    />

<Modal
open={modal}
onCancel={onClose}
footer={null}
title={<h2>Registration Form</h2>}
width={720}
>

<Form
layout="vertical"
onFinish={id ? onUpdate : onFinish}
form={regForm}
>


<Form.Item label="Profile" name="profile">
<Input type="file" onChange={handleImage} />
</Form.Item>

{formConfig.map(field => (

<Form.Item
key={field.name}
label={field.label}
name={field.name}
rules={field.required ? [{ required: true }] : []}
>

{field.type === "select" ? (

<Select placeholder={`Select ${field.label}`}>

{(field.optionsApi 
  ? dynamicOptions[field.name] 
  : field.options
)?.map(option => (

<Select.Option key={option} value={option}>
{option}
</Select.Option>

))}

</Select>

) : field.type === "textarea" ? (

<Input.TextArea />

) : (

<Input type={field.type} />

)}

</Form.Item>

))}

<Form.Item>

<Button
htmlType="submit"
className={`w-full text-white ${id ? "bg-rose-600" : "bg-blue-600"}`}
icon={<PlusOutlined />}
disabled={disabled}
>

{id ? "Update Now" : "Register Now"}

</Button>

</Form.Item>

</Form>

</Modal>
</>
)}
</div>

);
};

export default App;