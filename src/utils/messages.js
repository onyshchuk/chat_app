const generateMessage = (username, text) => ({
   username,
   text,
   createdAt: new Date().getTime(),
});

const generateLocationMessages = (username, url) => ({
   username,
   url,
   createdAt: new Date().getTime(),
});

module.exports = { generateMessage, generateLocationMessages };
