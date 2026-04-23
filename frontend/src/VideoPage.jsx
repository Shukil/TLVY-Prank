import React, { useState, useRef } from 'react';
import './VideoPage.css';

function VideoPage() {
  const [hasStarted, setHasStarted] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const audioRef = useRef(null);

  const handleStart = () => {
    setIsLoading(true); 

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
      }).catch(err => console.log(err));
    }

    // ממתין 2 שניות ואז מקפיץ את האזהרה
    setTimeout(() => {
      window.alert("תל אביב צהובה\nתשתחוו יבני *****");

      setHasStarted(true);
      
      if (audioRef.current) {
        audioRef.current.volume = 0.5; 
        audioRef.current.currentTime = 174; 
        audioRef.current.play();
      }
    }, 2000);
  };

  return (
    <div className="video-page-wrapper" dir="rtl">
      
      {hasStarted && (
        <>
          <img src="/bg-image.jpg" alt="Background" className="background-image" />
          <div className="video-overlay"></div>
        </>
      )}
      
      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {!hasStarted ? (
        <div className="start-screen">
          <img src="/maccabi.png" alt="Maccabi" className="video-logo" />
          <h1>הבקשה אושרה בהצלחה!</h1>
          <p>האישור הונפק ונמצא במערכת. לחץ על הכפתור להצגת אישור הכניסה הרשמי שלך לתל אביב.</p>
          
          <button 
            onClick={handleStart} 
            className="start-button" 
            disabled={isLoading}
          >
            {isLoading ? 'מאמת נתונים מול השרת...' : 'הצג אישור כניסה'}
          </button>
        </div>
      ) : (
        <div className="karaoke-container">
          <h1 className="karaoke-text">
            אני מכבי<br />מי אתם בכלל!
          </h1>
        </div>
      )}
      
    </div>
  );
}

export default VideoPage;