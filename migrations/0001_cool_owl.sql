CREATE TABLE `collation` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`total_budget` real NOT NULL,
	`created_timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by_id` text NOT NULL,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `receipts_segmented_amounts_spender` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`imageURL` text,
	`collation_id` text NOT NULL,
	FOREIGN KEY (`collation_id`) REFERENCES `collation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `receipt` (
	`id` text PRIMARY KEY NOT NULL,
	`total_amount` real NOT NULL,
	`segmented_amounts` text,
	`image_objkey` text DEFAULT '' NOT NULL,
	`created_timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`collation_id` text NOT NULL,
	FOREIGN KEY (`collation_id`) REFERENCES `collation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE user ADD `created_timestamp` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE user ADD `updated_timestamp` text DEFAULT (CURRENT_TIMESTAMP);