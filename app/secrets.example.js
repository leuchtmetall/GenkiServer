var secrets = {};

secrets.username = 'user'
secrets.password = 'test123'

// these need to mach those set in the android-app source code
secrets.deviceTokenSecret = 'abc123'
secrets.serverAuthSecretPre = 'abc123'
secrets.serverAuthSecretPost = 'abc123'

module.exports = secrets;