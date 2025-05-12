	let countdownInterval;
    let timerEnabled = true;
    let originalTitle = "";

    let currentUrl = location.href;

    const observer = new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            handleUrlChange(currentUrl); // Call your function here
        }
    });

    // Create Toggle Button
    const button = document.createElement('button');
    button.id = 'refreshToggleButton';
    button.textContent = 'REFRESH IS ON'; // Default ON
    button.style.position = 'fixed';
    button.style.top = '0';
    button.style.right = '0';
    button.style.marginTop = '10%';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
	button.style.borderRadius = '10px 0px 0px 10px';;

    button.addEventListener('click', () => {
        toggleTimer();
    });

    document.body.appendChild(button);

    observer.observe(document.body, { childList: true, subtree: true });

    function handleUrlChange(url) {
        if(url?.includes("https://www.pokemoncenter.com/product")){
            button.style.display = "block";
            if(timerEnabled){
                scheduleRefresh();
            }
        }else{
            clearInterval(countdownInterval); // Stop countdown
            document.title = `${originalTitle}`;
            button.style.display = "none";
        }
    }

    function init(){
        originalTitle = document.title; // Save the original title
        scheduleRefresh(); // Start countdown timer
        handleUrlChange(window.location.href);
    }

   function toggleTimer(){
        timerEnabled = !timerEnabled;
        button.textContent = timerEnabled ? 'REFRESH IS ON' : 'REFRESH IS OFF';
        button.style.backgroundColor = timerEnabled ? 'green' : 'red';

        if (!timerEnabled) {
            clearInterval(countdownInterval); // Stop countdown
            document.title = `⏸️ Paused - ${originalTitle}`;
        } else {
            scheduleRefresh(); // Resume countdown
        }
    }

    function scheduleRefresh() {
        const now = new Date();
        const nextRefresh = new Date(now);

        // Set next refresh to the next xx:59:59
        nextRefresh.setHours(now.getHours() + 1);
        nextRefresh.setMinutes(0);
        nextRefresh.setSeconds(-1);

        function updateCountdown() {
            if (!timerEnabled) return;

            const remainingTime = nextRefresh - new Date();

            if (remainingTime <= 0) {
                document.title = 'Refreshing...';
                location.reload();
                return;
            }

            const minutes = Math.floor(remainingTime / 60000); // Convert ms to minutes
            const seconds = Math.floor((remainingTime % 60000) / 1000); // Remaining seconds

            document.title = `⏳ ${minutes}:${seconds.toString().padStart(2, '0')} - ${originalTitle}`;
        }

        clearInterval(countdownInterval); // Clear previous timer
        countdownInterval = setInterval(updateCountdown, 1000); // Update every second
    }

    
    init();