import React, { useState } from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Upload,
  Image,
  Spin,
} from "antd";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "config/firebase";

const Add = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    description: "",
    productId: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
  });
  const [fileListMain, setFileListMain] = useState([]);
  const [fileListSecondary, setFileListSecondary] = useState([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [secondaryImageUrls, setSecondaryImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [availableColors, setAvailableColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("");

  const auth = getAuth();
  const storage = getStorage();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMainImageUpload = async ({ fileList: newFileList }) => {
    setFileListMain(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `images/${file.name}`);
      setUploading(true);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setMainImageUrl(url);
      } catch (error) {
        window.toastify("Error uploading file", "error");
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSecondaryImagesUpload = async ({ fileList: newFileList }) => {
    setFileListSecondary(newFileList);
    const urls = [];
    setUploading(true);

    for (const fileObj of newFileList) {
      const file = fileObj.originFileObj;
      const storageRef = ref(storage, `images/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        urls.push(url);
      } catch (error) {
        window.toastify("Error uploading secondary images", "error");
        console.error("Error uploading file:", error);
      }
    }

    setSecondaryImageUrls(urls);
    setUploading(false);
  };

  const handleAddItem = async () => {
    if (!auth.currentUser) {
      window.toastify("No user is signed in", "error");
      return;
    }

    if (
      !mainImageUrl ||
      !formData.itemName ||
      !formData.price ||
      secondaryImageUrls.length < 2
    ) {
      window.toastify(
        "Please fill in all fields and upload all images",
        "error"
      );
      return;
    }

    const uid = auth.currentUser.uid;
    const productRef = doc(firestore, "items", formData.productId);

    try {
      await setDoc(productRef, {
        ...formData,
        mainImageUrl: mainImageUrl,
        secondaryImageUrls: secondaryImageUrls,
        availableColors: availableColors,
        createdBy: uid,
      });
      window.toastify("Item added successfully", "success");

      // Reset form
      setFileListMain([]);
      setFileListSecondary([]);
      setMainImageUrl("");
      setSecondaryImageUrls([]);
      setFormData({
        itemName: "",
        price: "",
        description: "",
        productId: Math.floor(
          1000000000 + Math.random() * 9000000000
        ).toString(),
      });
      setAvailableColors([]);
    } catch (error) {
      window.toastify("Error adding item", "error");
      console.error("Error adding item:", error);
    }
  };

  const addColor = () => {
    if (currentColor) {
      setAvailableColors([...availableColors, currentColor]);
      setCurrentColor("");
    }
    console.log(availableColors);
  };

  const resetColors = () => {
    setAvailableColors([]);
  };
 
  return (
    <Card style={{ border: "none", width: "100%", margin: "20px auto" }}>
      <Typography.Title level={1}>List new product</Typography.Title>
      <Input
        name="itemName"
        placeholder="Item Name"
        value={formData.itemName}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <Input
        name="price"
        placeholder="Price"
        type="number"
        value={formData.price}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <Input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />

      <Typography.Title level={5}>Available Colors</Typography.Title>
      <input
        type="color"
        value={currentColor} // Controlled state for color
        onChange={(e) => {
          // Ant Design ColorPicker should return color.hex
          setCurrentColor(e.target.value);
        }}
      />

      <Button type="dashed" onClick={addColor} style={{ marginTop: "10px" }}>
        + Add Color
      </Button>

      <div style={{ display: "flex", flexWrap: "wrap", margin: "10px 0" }}>
        {availableColors.map((color, index) => (
          <div
            key={index}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: color,
              margin: "5px",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {availableColors.length > 0 && (
        <Button
          type="default"
          onClick={resetColors}
          style={{ marginTop: "10px" }}
        >
          Reset Colors
        </Button>
      )}

      <Typography.Title level={5}>Upload one Main Image</Typography.Title>
      <Upload
        listType="picture-card"
        fileList={fileListMain}
        onChange={handleMainImageUpload}
        accept=".jpg, .jpeg, .png"
        beforeUpload={() => false}
      >
        {fileListMain.length < 1 && "+ Upload"}
      </Upload>
      {uploading && <Spin tip="Uploading main image..." />}
      {mainImageUrl && (
        <Image
          src={mainImageUrl}
          alt="Uploaded Main Image"
          style={{ width: "100px", height: "100px", margin: "10px" }}
          onClick={() => window.open(mainImageUrl)}
        />
      )}

      <Typography.Title level={5}>Upload 2 Secondary Images</Typography.Title>
      <Upload
        listType="picture-card"
        fileList={fileListSecondary}
        onChange={handleSecondaryImagesUpload}
        accept=".jpg, .jpeg, .png"
        beforeUpload={() => false}
        multiple
      >
        {fileListSecondary.length < 2 && "+ Upload"}
      </Upload>
      {uploading && <Spin tip="Uploading secondary images..." />}
      {secondaryImageUrls.length > 0 &&
        secondaryImageUrls.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`Secondary Image ${index + 1}`}
            style={{ width: "100px", height: "100px", margin: "10px" }}
            onClick={() => window.open(url)}
          />
        ))}

      <Button
        type="primary"
        style={{ width: "100%", marginTop: "10px" }}
        onClick={handleAddItem}
      >
        Add Item
      </Button>
    </Card>
  );
};

export default Add;
