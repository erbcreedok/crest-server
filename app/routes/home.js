const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
  res.send(`<pre>hello</pre>`);
})

module.exports = router
