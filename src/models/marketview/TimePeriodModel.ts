import * as moment from 'moment';

export class TimePeriodModel {
	private static START_DATE: number = 0;
	private static END_DATE: number = 1;
	private week: any = new Set();
	private month: any = new Set();
	private year: any = new Set();
	private time_mode: number = TimePeriodModel.START_DATE;
	private current_time_period: TimeFrame = new TimeFrame();
	private previous_time_period: TimeFrame = new TimeFrame();

	/**
	 * Adds a week to the week set
	 * @param string week
	 * @return void
	 */
	addWeek(week: string): void {
		this.week.add(week)
	}

	/**
	 * Retrieves the week set
	 * @return any
	 */
	getWeek(): any {
		return Array.from(this.week);
	}

	/**
	 * Adds a month to the month set
	 * @param string month
	 * @return void
	 */
	addMonth(month: string): void {
		this.month.add(moment(new Date(month)).startOf('month').format('MMMM DD YYYY') + ' - ' + moment(new Date(month)).endOf('month').format('MMMM DD YYYY'))
	}

	/**
	 * Retrieves the month set
	 * @return any
	 */
	getMonth(): any {
		return Array.from(this.month);
	}

	/**
	 * Adds a year to the year set
	 * @param string year
	 * @return void
	 */
	addYear(year: string): void {
		this.year.add(moment('Jan 1 ' + year).startOf('year').format('MMMM DD YYYY') + ' - ' + moment('Dec 31 ' + year).endOf('year').format('MMMM DD YYYY'))
	}

	/**
	 * Retrieves the year set
	 * @return any
	 */
	getYear(): any {
		return Array.from(this.year);
	}

	/**
	 * Update time mode to start date
	 * @return void
	 */
	useStartDate(): void {
		this.time_mode = TimePeriodModel.START_DATE;
	}

	/**
	 * Update time mode to end date
	 * @return void
	 */
	useEndDate(): void {
		this.time_mode = TimePeriodModel.END_DATE;
	}


	/**
	 * Returns the current time mode
	 * @return number
	 */
	getTimeMode(): number {
		return this.time_mode;
	}

	/**
	 * Updates time period
	 * @param string start
	 * @param string end
	 * @param bool current_mode
	 * @return void
	 */
	setTimePeriod(start: string, end: string, current_mode: boolean = true): void {
		const time_period = current_mode ? this.current_time_period : this.previous_time_period;
		time_period.set(start, end);
	}

	/**
	 * Retrieves time period
	 * @param bool current_mode
	 * @return object
	 */
	getTimePeriod(current_mode: boolean = true): any {
		return current_mode ? this.current_time_period.get() : this.previous_time_period.get();
	}
}

/**
 * An object that keeps track of the start and end of the time period 
 */
class TimeFrame {
	private start: Date;
	private end: Date;

	/**
	 * Sets the new start and end points
	 * @param string start
	 * @param string end
	 * @return void
	 */
	set(start: string = null, end: string = null): void {
		this.start = start ? new Date(start) : null;
		this.end = end ? new Date(end) : null;
	}

	/**
	 * Gets the start and end points
	 * @return object
	 */
	get(): {period_start: Date, period_end: Date} {
		return {
			period_start: this.start,
			period_end: this.end
		};
	}
}