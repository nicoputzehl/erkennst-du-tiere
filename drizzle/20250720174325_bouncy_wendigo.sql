CREATE TABLE `hint_state` (
	`question_id` integer PRIMARY KEY NOT NULL,
	`used_hints` text DEFAULT '[]',
	`wrong_attempts` integer DEFAULT 0,
	`auto_free_hints_used` text DEFAULT '[]',
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `question_state` (
	`question_id` integer PRIMARY KEY NOT NULL,
	`quiz_id` text NOT NULL,
	`status` text DEFAULT 'inactive' NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `question_state_quiz_idx` ON `question_state` (`quiz_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`quiz_id` text NOT NULL,
	`images` text NOT NULL,
	`answer` text NOT NULL,
	`alternative_answers` text,
	`fun_fact` text,
	`wikipedia_name` text,
	`title` text,
	`custom_hints` text DEFAULT '[]',
	`contextual_hints` text DEFAULT '[]',
	`auto_free_hints` text DEFAULT '[]',
	FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `questions_quiz_idx` ON `questions` (`quiz_id`);--> statement-breakpoint
CREATE TABLE `quiz` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`title_image` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `quiz_config` (
	`id` text PRIMARY KEY NOT NULL,
	`initially_locked` integer DEFAULT false,
	`unlock_condition` text,
	`order` integer DEFAULT 1,
	`initial_unlocked_questions` integer DEFAULT 2,
	FOREIGN KEY (`id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quiz_config_order_idx` ON `quiz_config` (`order`);--> statement-breakpoint
CREATE TABLE `quiz_state` (
	`quiz_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`completed_questions` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ui_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`current_quiz_id` text,
	`is_loading` integer DEFAULT false,
	`loading_operations` text DEFAULT '[]',
	`toast` text,
	`navigation_history` text DEFAULT '[]',
	`pending_unlocks` text DEFAULT '[]',
	`updated_at` integer,
	FOREIGN KEY (`current_quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_points_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total_points` integer DEFAULT 50,
	`earned_points` integer DEFAULT 50,
	`spent_points` integer DEFAULT 0,
	`points_history` text DEFAULT '[]',
	`updated_at` integer
);
