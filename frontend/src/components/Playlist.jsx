// import React from 'react'

// const Playlist = ({playlist}) => {
//   return (
//     <div>

//         <img src={playlist.snippet.thumbnails.default.url} alt={playlist.snippet.title} width={"50px"}/>
//         <div>
//             <h3>{playlist.snippet.title}</h3>
//             <p>{playlist.snippet.description}</p>
//         </div>
//     </div>
//   )
// }

// export default Playlist



import React from 'react'

const Playlist = ({ playlist }) => {
  return (
    <div style={{
      display: 'flex',       // Makes image and text align horizontally
      alignItems: 'center',   // Centers items vertically
      gap: '20px',            // Adds space between image and text
      marginBottom: '10px'    // Adds space between playlist items
    }}>
      <img 
        src={playlist.snippet.thumbnails.default.url} 
        alt={playlist.snippet.title} 
        width="50px"
      />
      <div>
        <h3>{playlist.snippet.title}</h3>
        <p>{playlist.snippet.description}</p>
      </div>
    </div>
  )
}

export default Playlist
