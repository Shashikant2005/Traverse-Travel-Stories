import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function ViewUser() {
    // Access the state passed from navigate
    const location = useLocation();
    const navigate = useNavigate()
    const { story } = location.state || {}; // Get the `story` object
    let date = new Date(story.visitondate).toLocaleString()

    if (!story) {
        return (
            <div>
                <CssBaseline />
                <Container maxWidth="sm">
                    <Box sx={{ bgcolor: '#f8d7da', height: '100vh' }}>
                        <Typography variant="h6" color="error" align="center" sx={{ paddingTop: '20px' }}>
                            Story not found!
                        </Typography>
                    </Box>
                </Container>
            </div>
        );
    }

    return (
        <div className='pt-10 rounded-lg bg-cyan-50/20' >
           <button className='mx-4 text-2xl bg-cyan-500 px-2 rounded-md  hover:bg-cyan-100' onClick={()=>navigate("/feed")}>Back</button>
            <div>
            <CssBaseline />
            <Container maxWidth="sm" className='rounded-md'>
                <Box sx={{ bgcolor: 'rgb(236 254 255)', height: 'auto', padding: 2,borderRadius:5 }}>

                    <Typography variant="h4" component="h1" gutterBottom>
                        {story.title} 
                    </Typography>

                    <Typography variant="body1" paragraph>
                       <div>
                          {
                            story?.visitedlocation.map((item,index)=>{
                                 return (
                                    <h2>{item}</h2>
                                 )
                            })
                          }
                       </div>
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <div>{date}</div>
                    </Typography>
                   
                    <Typography variant="body1" paragraph>
                        <img className='w-full' src={story.imageurl} alt="StoryImage" />
                    </Typography>
                    <Typography variant="h6" color="textSecondary" paragraph>
                        {story.story}
                    </Typography>
                    
                </Box>
            </Container>
        </div>
     </div> 
    );
}

export default ViewUser;
