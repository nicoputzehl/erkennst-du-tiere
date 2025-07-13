CREATE TABLE `auto_free_hints_used` (
	`question_id` integer NOT NULL,
	`hint_id` text NOT NULL,
	`activated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `auto_free_hints_used_pk` ON `auto_free_hints_used` (`question_id`,`hint_id`);--> statement-breakpoint
CREATE TABLE `hint_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` integer NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`content` text NOT NULL,
	`cost` integer,
	`triggers` text,
	`trigger_after_attempts` integer,
	`trigger_specific_content` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_hint_definitions_question` ON `hint_definitions` (`question_id`);--> statement-breakpoint
CREATE TABLE `hint_states` (
	`question_id` integer PRIMARY KEY NOT NULL,
	`wrong_attempts` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `navigation_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` text NOT NULL,
	`visited_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_navigation_history_date` ON `navigation_history` (`visited_at`);--> statement-breakpoint
CREATE TABLE `pending_unlocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` text NOT NULL,
	`quiz_title` text NOT NULL,
	`unlocked_at` text DEFAULT CURRENT_TIMESTAMP,
	`shown` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_pending_unlocks_shown` ON `pending_unlocks` (`shown`);--> statement-breakpoint
CREATE TABLE `point_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`reason` text NOT NULL,
	`quiz_id` text,
	`question_id` integer,
	`hint_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_point_transactions_date` ON `point_transactions` (`created_at`);--> statement-breakpoint
CREATE TABLE `question_images` (
	`question_id` integer PRIMARY KEY NOT NULL,
	`image_data` blob NOT NULL,
	`image_type` text NOT NULL,
	`thumbnail_data` blob,
	`thumbnail_type` text,
	`unsolved_image_data` blob,
	`unsolved_image_type` text,
	`unsolved_thumbnail_data` blob,
	`unsolved_thumbnail_type` text,
	`image_size` integer,
	`image_width` integer,
	`image_height` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `question_states` (
	`question_id` integer PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'inactive' NOT NULL,
	`solved_at` text,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_question_states_status` ON `question_states` (`status`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`quiz_id` text NOT NULL,
	`answer` text NOT NULL,
	`alternative_answers` text,
	`fun_fact` text,
	`wikipedia_name` text,
	`title` text,
	`order_index` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_questions_quiz_id` ON `questions` (`quiz_id`);--> statement-breakpoint
CREATE INDEX `idx_questions_order` ON `questions` (`quiz_id`,`order_index`);--> statement-breakpoint
CREATE TABLE `quiz_states` (
	`quiz_id` text PRIMARY KEY NOT NULL,
	`completed_questions` integer DEFAULT 0 NOT NULL,
	`completed_at` text,
	`last_played_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_quiz_states_completed` ON `quiz_states` (`completed_questions`);--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`title_image` blob,
	`title_image_type` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`initially_locked` integer DEFAULT false NOT NULL,
	`initial_unlocked_questions` integer DEFAULT 2 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_quizzes_order` ON `quizzes` (`order_index`);--> statement-breakpoint
CREATE TABLE `unlock_conditions` (
	`quiz_id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`required_quiz_id` text NOT NULL,
	`required_questions_solved` integer,
	`description` text NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`required_quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `used_hints` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`hint_id` text NOT NULL,
	`hint_title` text NOT NULL,
	`hint_content` text NOT NULL,
	`used_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_used_hints_question` ON `used_hints` (`question_id`);--> statement-breakpoint
CREATE TABLE `user_points` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`total_points` integer DEFAULT 50 NOT NULL,
	`earned_points` integer DEFAULT 50 NOT NULL,
	`spent_points` integer DEFAULT 0 NOT NULL,
	`last_updated` text DEFAULT CURRENT_TIMESTAMP
);
