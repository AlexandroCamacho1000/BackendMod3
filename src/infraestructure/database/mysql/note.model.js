import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const NoteModel = sequelize.define("Note", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url'
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_private'
  },
  password: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id'
  }
}, {
  timestamps: true,
  tableName: 'notes'
});

export default NoteModel;