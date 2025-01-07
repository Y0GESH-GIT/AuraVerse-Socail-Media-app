import React, { useEffect, useState } from 'react';
import { Breadcrumb, Space, Avatar, Layout, List, theme, Button, message, Popconfirm, Input, Modal } from 'antd';
import { HeartOutlined, MessageOutlined } from '@ant-design/icons';
import NavBar from '../Navbar/Navbar';
import axios from 'axios';

const { Content } = Layout;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const cancel = (e) => {
  console.log(e);
};

const Home = () => {
  const [post, setPost] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [editFields, setEditFields] = useState({
    title: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3100/post/getAll')
      .then((res) => {
        console.log(res.data);
        const { result } = res.data;
        setPost(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const AddLike = (id, Count) => {
    const body = {
      id,
      dataToUpdate: {
        likescount: Count+1,
      },
    };
    axios.put('http://localhost:3100/post/update', body)
      .then((res) => {
        console.log(res.data)
           setRefresh(prev => !prev);
            })
      .catch((err) => {
        console.log(err);
      });
  };
  // handleEditChange(e)  # Event handler function triggered by input change
  // ├─ setEditFields()  # Updates the state with new field values
  // │    ├─ ...editFields  # Copy existing state (preserve other fields)
  // │    └─ [e.target.name]: e.target.value  # Update the field based on input's name and value

  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const EditPost = () => {
    const { title, description, location } = editFields;
    if (!title) {
      alert("Title is required!");
      return; 
    }
    const body = {
      id: currentPost._id,
      dataToUpdate: {
        title,
        description,
        location,
      },
    };
  
    
    axios.put('http://localhost:3100/post/update', body)
      .then((res) => {
        console.log(res.data);
        if (res.data.result) { 
          message.success('Post updated successfully!');
          setRefresh((prev) => !prev); 
          setEditModalVisible(false); // Close the modal after saving
        } else {
          message.error('Failed to update post');
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to update post');
      });
  };
  
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3100/post/delete/${id}`)
      .then((res) => {
        console.log(res.data);
        message.success('Deleted Post');
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavBar setRefresh={setRefresh} />
      <Layout>
        <Content style={{ margin: '0 300px' }}>
          <Breadcrumb style={{ margin: '20px 0', fontSize: '24px' }}>
            <Breadcrumb.Item>Posts</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 20,
              minHeight: '200vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <List
              itemLayout="vertical"
              size="large"
              dataSource={post}
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                  actions={[
                    <Button
                      color="default"
                      variant="link"
                      onClick={() => AddLike(item._id, item.likescount)}
                    >
                      <IconText
                        icon={HeartOutlined}
                        text={item.likescount}
                        key="list-vertical-heart-o"
                      />
                    </Button>,
                    <Button color="default" variant="link">
                      <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />
                    </Button>,
                    <Button onClick={() => {
                      setCurrentPost(item);
                      setEditFields({
                        title: item.title,
                        description: item.description,
                        location: item.location
                      });
                      setEditModalVisible(true);
                    }}>
                      Edit
                    </Button>,
                    <Popconfirm
                      title="Delete the post"
                      description="Are you sure you want to delete this post?"
                      onConfirm={() => deletePost(item._id)}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button>Delete</Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={
                      <>
                        {item.location}
                        <img
                          width={450}
                          alt="Post"
                          src="https://cdn.mos.cms.futurecdn.net/3JCaEkiSwWKAwgLMjpChF3.jpg"
                        />
                      </>
                    }
                  />

                  <div style={{ marginTop: 16 }}>{item.description}</div>
                </List.Item>
              )}
            />
          </div>
        </Content>
      </Layout>

      {/* Edit Post Modal */}
      <Modal
        title="Edit Post"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={EditPost}>
            Save Changes
          </Button>,
        ]}
      >
        <Input
          name="title"
          value={editFields.title}
          onChange={handleEditChange}
          placeholder="Title"
          style={{ marginBottom: 10 }}
        />
        <Input
          name="description"
          value={editFields.description}
          onChange={handleEditChange}
          placeholder="Description"
          style={{ marginBottom: 10 }}
        />
        <Input
          name="location"
          value={editFields.location}
          onChange={handleEditChange}
          placeholder="Location"
          style={{ marginBottom: 10 }}
        />
      </Modal>
    </Layout>
  );
};

export default Home;
