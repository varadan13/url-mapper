import fs from "fs";

const saveObject = (jsonContent) =>
  fs.writeFile("object.json", jsonContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Object has been saved to object.json");
  });

export default saveObject;
