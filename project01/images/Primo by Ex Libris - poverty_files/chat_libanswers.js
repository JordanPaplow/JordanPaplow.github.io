function OpenLNetWindow()
{
	ChatPopup();
}

function ChatPopup()
{
	// check if chat is online
	jQuery.ajax({
		url: "https://library.pdx.edu/api/rest/chat/chat_status.php",
		cache: false,
		async: false,
		success: function(status) {
			// console.log("status: " + status);
			if(status == "available" || status == "chat")
			{
				var win = window.open("https://libraryh3lp.com/chat/psulibrarys-queue@chat.libraryh3lp.com?skin=26440&sounds=true&popout=1&sounds=1", "Chat", "height=480,width=280,toolbar=no,menubar=no,resizable=no,scrollbars=yes");
				if (win) {
					win.focus();
				}
				_gaq.push(['_trackEvent', 'Popup', 'Click-Chat', "LibraryH3lp Chat"]);
			}
			else
			{
				var win = window.open("https://content.library.pdx.edu/static/chat_answerland/", "Chat", "height=400,width=280,toolbar=no,menubar=no,resizable=no,scrollbars=yes");
				if (win) {
					win.focus();
				}
				_gaq.push(['_trackEvent', 'Popup', 'Click-Chat', "LibAnswers Chat"]);
			}
			
		}
	});
}