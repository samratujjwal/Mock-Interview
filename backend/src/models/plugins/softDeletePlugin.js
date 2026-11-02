import mongoose from 'mongoose';

const SOFT_DELETE_FILTERED_OPERATIONS = [
  'count',
  'countDocuments',
  'find',
  'findOne',
  'findOneAndDelete',
  'findOneAndReplace',
  'findOneAndUpdate',
  'updateMany',
  'updateOne',
];

const shouldFilterDeletedDocuments = (query) => query.getOptions().withDeleted !== true;

const applySoftDeleteFilter = function applySoftDeleteFilter(next) {
  if (shouldFilterDeletedDocuments(this)) {
    this.where({ isDeleted: false });
  }

  next();
};

export const softDeletePlugin = (schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  });

  for (const operation of SOFT_DELETE_FILTERED_OPERATIONS) {
    schema.pre(operation, applySoftDeleteFilter);
  }

  schema.methods.softDelete = function softDelete(deletedBy = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;

    return this.save();
  };

  schema.methods.restore = function restore() {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;

    return this.save();
  };
};
