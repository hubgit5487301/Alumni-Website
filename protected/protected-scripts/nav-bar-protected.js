let headerhtml = `
          <div class="left-content">
            <a href="/dashboard" class="home-link">
              <button class="home-button">
                <img src="/images/logo.png" class="logo-icon">
                Alumni Portal</button> 
            </a>
          </div>
          <div class="middle-content">
            <a class="link" href="/dashboard">
            <img class="home-icon js-nav-icon" src="/images/home.svg"></a>
            <a class="link" href="/protected/alumni-directory">
            <img class="friends-icon js-nav-icon" src="/images/friends.svg"></a>
            <a class="link" href="/protected/event-directory">
            <img class="events-icon js-nav-icon" src="/images/events.svg"></a>
            <a class="link" href="/protected/job-directory">
            <img class="job-icon js-nav-icon" src="/images/job.svg"></a>
            <a class="link" href="/protected/contact-us">
            <img class="contact-us-icon js-nav-icon" src="/images/contact-us.svg"></a>
          </div>
          <div class="right-content">
            <a class="link" href="/logout">
              <button type="submit" class="logout-button js-logout-button">Logout</button></a> 
            <a class="link" href="/login">
            <img class="profile-icon js-nav-icon" src="/images/blank-profile-pic.svg"></a>
          </div>
        ` ;

document.querySelector('.js-top-box').innerHTML = headerhtml;



const footerhtml =
      `
            <div class="footer-left-content">
                <p>Copyright <span>&#169;</span> 2024</p>
            </div>
            <div class="footer-middle-content">
              <div class="social-links">
                <a href="https://www.linkedin.com/company/ietagra/?originalSubdomain=in" >
                <img class="social-icon" src="/images/linkedin.svg" alt="linkedin"></a>
                <a href="https://www.instagram.com/iet_khandari_agra_official/" >
                <img class="social-icon" src="/images/instagram.svg" alt="linkedin"></a>
                <a href="https://www.facebook.com/IETDBRAUAGRA/" >
                <img class="social-icon" src="/images/facebook.svg" alt="linkedin"></a>
                <!--<button class='dark-mode-button js-dark-mode-button'>mode</button>-->
              </div>
            </div>
            <div class="footer-right-content">
              <a class="footer-policy" href="">Terms | Privacy Policy</a>
            </div> `
        
document.querySelector('.js-bottom').innerHTML = footerhtml;

