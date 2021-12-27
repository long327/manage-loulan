export default {
	startDatePicker(date1, date2) {
		return {
			disableDate(time) {
				if (date1 && date2) {
					//时间要控制在一个范围内时
					return new Date(date1).getTime() > time.getTime() || new Date(date2).getTime < time.getTime();
				} else {
					if (date1) {
						return new Date(date1).getTime() > time.getTime();
					}
					if (date2) {
						return new Date(date2).getTime < time.getTime();
					}
				}
			}
		}
	},

	endDatePicker(date1, date2) {
		return {
			disableDate(time) {
				if (date1 && date2) {
					//时间要控制在一个范围内时
					return new Date(date1).getTime() > time.getTime() || new Date(date2).getTime < time.getTime();
				} else {
					if (date1) {
						return new Date(date1).getTime() > time.getTime();
					}
					if (date2) {
						return new Date(date2).getTime < time.getTime();
					}
				}
			}
		}
	}
}