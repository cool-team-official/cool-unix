import type { ChartsEvent } from "./Interface";
export class TuiChartsEvent {
	private events = new Map<string, ChartsEvent[] | null>();
	constructor() {}
	trigger(type: string) {
		if (this.events.get(type) != null) {
			const listeners = this.events.get("type") as ChartsEvent[];
			listeners.forEach((listener: ChartsEvent) => {
				try {
					listener();
				} catch (e) {}
			});
		}
	}
}
