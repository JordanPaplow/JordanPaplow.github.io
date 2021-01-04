// load today's hours via json from api
jQuery(function($) {
	$.ajax({
		cache: false,
		url: "https://library.pdx.edu/api/rest/hours/load_hours.php?num_days=7",
		dataType: "json",
		success: function(json) {
			var todays_hours = "";
			var footer_hours = "";
			var day_count = 1;
			
			for(var day in json) {
			
				var days_hours = json[day];
				
				if(day_count == 1)
				{
					todays_hours = days_hours["hours_label"];
					footer_hours += '<div class="psulib-footer-content-text"><span class="psulib-footer-hours-label">Today</span><span class="psulib-footer-hours-value">'+days_hours["hours_label"]+'</span></div>';
				}
				else if (day_count > 7)
				{
				}
				else
					footer_hours += '<div class="psulib-footer-content-text"><span class="psulib-footer-hours-label">'+days_hours["dow"]+'</span><span class="psulib-footer-hours-value">'+days_hours["hours_label"]+'</span></div>';
					
				day_count++;
			}
			
			$("#psulib-top-bar-hours-value").html(todays_hours);
			$("#psulib-footer-hours").html(footer_hours);
			
		}
	});
});