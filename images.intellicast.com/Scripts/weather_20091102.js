function changeDay(dayNumber) {
for (var i = 0; i < 10; i++) {
if (dayNumber == i) {
$("#dow" + i).addClass("Selected");
$("#fwx" + i).addClass("FWXSelected");
$("#detail" + i).addClass("Selected");}
else {
$("#dow" + i).removeClass("Selected");
$("#fwx" + i).removeClass("FWXSelected");
$("#detail" + i).removeClass("Selected");}}}