// widgetManager.ts
import { IWidget } from '@/interfaces/widget.interface'

class WidgetManager {
	private widgets: Record<string, IWidget> = {};

	registerWidget(widget: IWidget) {
		this.widgets[widget.id] = widget;
	}

	enableWidget(id: string) {
		if (this.widgets[id]) {
			this.widgets[id].enabled = true;
		}
	}

	disableWidget(id: string) {
		if (this.widgets[id]) {
			this.widgets[id].enabled = false;
		}
	}

	// Weitere Methoden für das dynamische Laden von Widgets etc.
}

export const widgetManager = new WidgetManager();
