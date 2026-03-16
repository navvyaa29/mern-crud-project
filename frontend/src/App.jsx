import { Button, Image, Table, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined, EditFilled, DeleteFilled } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import useSwr, { mutate } from "swr";
import formConfig from "./formConfig.json";

axios.defaults.baseURL = "http://localhost:8080";

const App = () => {

const [regForm] = Form.useForm();
const [modal, setModal] = useState(false);
const [imgUrl, setImgUrl] = useState(null);
const [id, setId] = useState(null);
const [disabled, setDisabled] = useState(false);

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

const fetcher = async (url) => {
const { data } = await axios.get(url);
return data;
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
await axios.delete(`/register/${id}`);
mutate("/register");
message.success("Deleted successfully");
} catch {
message.error("Delete failed");
}
};

const onEdit = (obj) => {
delete obj.profile;
setModal(true);
regForm.setFieldsValue(obj);
setId(obj._id);
};

const onFinish = async (values) => {
console.log(values);
imgUrl
? values.profile = imgUrl
: values.profile =
"https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png";

try {

await axios.post("/register", values);

setModal(false);
regForm.resetFields();
setImgUrl(null);
mutate("/register");

message.success("User registered");

} catch (err) {

if (err.response?.data?.error?.code === 11000) {
return regForm.setFields([
{ name: "email", errors: ["Email already exists"] }
]);
}

message.error("Insert failed");
}
};

const onUpdate = async (values) => {

imgUrl
? values.profile = imgUrl
: delete values.profile;

try {

await axios.put(`/register/${id}`, values);

setModal(false);
setId(null);
regForm.resetFields();
mutate("/register");

message.success("Updated successfully");

} catch {
message.error("Update failed");
}
};

const onClose = () => {
setModal(false);
setId(null);
regForm.resetFields();
};

return (

<div className="min-h-screen bg-rose-100 flex flex-col items-center md:p-4">

<div className="flex justify-between items-center bg-blue-600 w-10/12 my-5 p-4">

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

{field.options.map(option => (

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

</div>

);
};

export default App;