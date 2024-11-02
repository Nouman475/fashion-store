import React, { useEffect, useState } from "react";
import { Table, Image, Button, Modal, Form, Input, Switch } from "antd";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "config/firebase";
import { useAuthContext } from "contexts/AuthContext";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const All = () => {
  const { user, isAuthenticated, isAppLoading } = useAuthContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchItems = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      const uid = user.uid;

      try {
        const q = query(collection(firestore, "items"), where("createdBy", "==", uid));
        const querySnapshot = await getDocs(q);

        const itemsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isAppLoading) {
      fetchItems();
    }
  }, [isAuthenticated, user, isAppLoading]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "items", id));
      setItems(items.filter(item => item.id !== id));
      window.toastify("Item deleted", "success");
    } catch (error) {
      console.error("Error deleting item:", error);
      window.toastify("Failed to delete item", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { itemName, price, description, mainImageUrl } = values;

      await updateDoc(doc(firestore, "items", editingItem.id), {
        itemName,
        price,
        description,
        mainImageUrl,
      });

      setItems(items.map(item => (
        item.id === editingItem.id
          ? { ...item, itemName, price, description, mainImageUrl }
          : item
      )));
      setIsModalVisible(false);
      window.toastify("Item updated", "success");
    } catch (error) {
      console.error("Error updating item:", error);
      window.toastify("Failed to update item", "error");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleStockChange = async (id, checked) => {
    try {
      await updateDoc(doc(firestore, "items", id), { isInStock: checked });
      setItems(items.map(item => (
        item.id === id
          ? { ...item, isInStock: checked }
          : item
      )));
      window.toastify("Stock status updated", "success");
    } catch (error) {
      console.error("Error updating stock status:", error);
      window.toastify("Failed to update stock status", "error");
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'mainImageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        imageUrl ? (
          <Image
            src={imageUrl}
            alt="Item"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        ) : (
          <span>No Image</span>
        )
      ),
    },
    {
      title: 'Name',
      dataIndex: 'itemName',
      key: 'name',
      render: (name) => <span style={{ fontSize: "14px" }}>{name}</span>,
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span style={{ fontSize: "14px" }}>{price}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <span style={{ fontSize: "12px", padding: "0 10px" }}>{description}</span>
      ),
    },
    {
      title: 'In Stock',
      dataIndex: 'isInStock',
      key: 'isInStock',
      render: (isInStock, record) => (
        <Switch 
          checked={isInStock} 
          onChange={(checked) => handleStockChange(record.id, checked)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            style={{ marginRight: 8 }} 
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)} 
            danger 
          />
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "10px", maxWidth: "100%" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>My Items</h2>
      <Table
        loading={loading}
        className="table-responsive"
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
      <Modal 
        title="Edit Item" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="itemName"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <Input type="number" placeholder="Enter item price" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter item description" />
          </Form.Item>
          <Form.Item
            name="mainImageUrl"
            label="Image URL"
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default All;
