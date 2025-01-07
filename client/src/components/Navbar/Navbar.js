import React, { useState } from 'react';
import {
  CompassOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  UploadOutlined,
  HomeFilled,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Modal, Form, Input, Upload, Button, message } from 'antd';
import axios from 'axios';
import './Navbar.css'; 

const { Sider } = Layout;

// Helper function to create the menu items
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Defining the items for the menu
const items = [
  getItem('Home', '1', <HomeFilled />),
  getItem('Search', '2', <SearchOutlined />),
  getItem('Explore', '3', <CompassOutlined />),
  getItem('Create', '4', <PlusSquareOutlined />), // This is the "Create" item
  getItem('Profile', '5', <UserOutlined />),
  getItem('More', '6', <MenuOutlined />),
];

const Navbar = ({setRefresh}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Use Ant Design form instance

  // Function to handle menu click
  const Create = (item) => {
    if (item.key === '4') {
      setIsModalVisible(true); // Open the dialog box when "Create" is clicked
    }
  };

  // Function to handle modal submission
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      const { title, description, location } = values;

      // Prepare the request body
      const body = {
        title: title,
        description: description,
        location: location,
      };
      console.log(body);
      // Axios POST request
      
      await axios.post('http://localhost:3100/post/create', body);
      setRefresh(prev => !prev);
      message.success('Post created successfully!');
      
      form.resetFields(); // Reset the form
      setIsModalVisible(false); // Close the modal
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response);
        message.error('Failed to create the post.');
      } else {
        console.error('Validation error:', error);
      }
    }
  };

  // Function to handle modal cancellation
  const handleCancel = () => {
    form.resetFields(); // Reset form fields when modal is canceled
    setIsModalVisible(false); // Close the modal
  };

  return (
    <Sider theme="dark">
      <h3 style={{ color: 'white', paddingLeft: '40px' }}>Auraverse</h3>
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        onClick={Create}
        // Attach the click handler
      />

      {/* Modal for "Create" */}
      <Modal
        title="Create Post"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title!' }]}
          >
            <Input placeholder="Enter post title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ message: 'Please enter a description!' }]}
          >
            <Input placeholder="Enter post description" />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please enter a location!' }]}
          >
            <Input placeholder="Enter post location" />
          </Form.Item>
          <Form.Item label="Upload Image" name="image">
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Sider>
  );
};
export default Navbar;