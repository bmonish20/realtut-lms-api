const mongoose = require('mongoose');

const roles = ['user', 'admin', 'trainer'];

const permissionSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: roles,
    unique: true
  },
  permissions: {
    type: [String],
    default: []
  }
});

permissionSchema.statics = {
  async fetchPermissions({ role }) {
    const permissionObj = await this.findOne({ role }).exec();
    if(!permissionObj)
      return [];
    return permissionObj.permissions;
  }
}

module.exports = mongoose.model('Permission', permissionSchema);