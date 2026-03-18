const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0cnVuYWxkdW5nYXJhbmkxNUBnbWFpbC5jb20iLCJleHAiOjE3NzQ0NTg2OTZ9._vsj9QjtpIozCRn2OTeVj90E9cBhfuJn7Sd3bjVElfw';

fetch('https://crickboss.live/v2/api/tournaments', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
