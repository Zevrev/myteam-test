import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function processTransactions(inputData) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const transactions = JSON.parse(inputData);

    const outputData = transactions.map((transaction) => {
      let balance = 0;
      let isValid = true;
      let errorReason = null;
      let parent;
      let childrent = [];

      // if one of their elements' transformation.qty is negative, this will be the parent, else push it to the children array
      transaction.transformations.forEach((transformation) => {
        if (transformation.qty < 0) {
          parent = transformation;
        } else {
          childrent.push(transformation);
        }
      });

      // if parent is not found, set isValid to false and errorReason to "Parent not found."
      if (!parent) {
        balance = null;
        isValid = false;
        errorReason = "Parent not found.";

        return {
          ...transaction,
          balance,
          isValid,
          errorReason,
        };
      } else {
        // sum up the balance by adding the parent's qty timing the parent's size to the balance of childrent's qty timing the childrent's size
        balance += parent.qty * parent.size;
        childrent.forEach((child) => {
          balance += child.qty * child.size;
        });

        if (balance !== 0) {
          isValid = false;
          errorReason = "Balance is not zero.";

          return {
            ...transaction,
            balance,
            isValid,
            errorReason,
          };
        }

        // if parent's partNum that does not match the child partNums, set isValid to false and errorReason to "Parent partNum does not match child partNums."
        const parentPartNum = parent.partNum;
        const childPartNums = childrent.map((child) => child.partNum);
        const isParentPartNumMatchChildPartNums = childPartNums.every(
          (childPartNum) => childPartNum === parentPartNum
        );
        if (!isParentPartNumMatchChildPartNums) {
          isValid = false;
          errorReason = "Parent partNum does not match child partNums.";

          return {
            ...transaction,
            balance,
            isValid,
            errorReason,
          };
        }

        // if each child in childrent's parts is shorter than 3 metres or longer than 12 metres
        const isChildPartSizeValid = childrent.every(
          (child) => child.size >= 3 && child.size <= 12
        );
        if (!isChildPartSizeValid) {
          isValid = false;
          errorReason = "Child part size is invalid.";

          return {
            ...transaction,
            balance,
            isValid,
            errorReason,
          };
        }

        // if each child in children that is not in increments of 0.3 metres within this range (i.e. 3, 3.3, 3.6, ... 11.7, 12), set isValid to false and errorReason to "Child part size is invalid."
        const isChildPartSizeIncrementValid = childrent.every(
          (child) => (child.size * 10) % 3 === 0
        );
        if (!isChildPartSizeIncrementValid) {
          isValid = false;
          errorReason = "Child part size is invalid.";

          return {
            ...transaction,
            balance,
            isValid,
            errorReason,
          };
        }
      }

      return {
        ...transaction,
        balance,
        isValid,
        errorReason,
      };
    });

    // write the outputData to data/output-data.json, if the file does not exist, it will be created
    const dataDir = path.join(__dirname, "../../myteam-test/data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const outputFile = path.join(dataDir, "output-data.json");
    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

    return outputData;
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
}
