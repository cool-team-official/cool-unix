declare module "@/uni_modules/cool-share" {
	export function shareWithSystem(options: {
		type: "text" | "image" | "file" | "link" | "video" | "audio";
		title?: string;
		summary?: string;
		url?: string;
		success?: () => void;
		fail?: (error: string) => void;
	}): void;
}
