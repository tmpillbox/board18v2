<?php
/*
 * config.php is included at the start of all pages and php routines
 * that access the board18 database.  Modify DB_HOST and if necessary
 * DB_DATABASE to contain the correct host and database name. You can
 * also change the database user ID and password here if you wish.
 * 
 * Copyright (c) 2013 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */
  define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
  define('DB_DATABASE', $_ENV['DB_DATABASE'] ?? 'board18');
  define('DB_USER', $_ENV['DB_USER'] ?? 'board18');
  define('DB_PASSWORD', $_ENV['DB_PASSWORD'] ?? 'board18');
?>
