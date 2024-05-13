/*
 SQLite does not support "Drop default from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3
                  https://stackoverflow.com/questions/9935593/sqlite3-change-column-default-value
 Due to that we don't generate migration automatically and it has to be done manually
*/
ALTER TABLE collation ADD `public` text NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE receipt RENAME COLUMN image_objkey TO image_objkey_old
--> statement-breakpoint
ALTER TABLE receipt ADD image_objkey TEXT NOT NULL;
--> statement-breakpoint
UPDATE receipt SET image_objkey = image_objkey_old;
--> statement-breakpoint
ALTER TABLE receipt DROP COLUMN image_objkey_old