process.on('message', function(m) {
  console.log('Child process received:', m);
});
  
process.send({ connected: true });