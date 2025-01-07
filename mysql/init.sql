-- UTF-8 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_connection = utf8mb4;
ALTER DATABASE ${MYSQL_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 데이터베이스가 없는 경우에만 생성
CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};
USE ${MYSQL_DATABASE};

-- 사용자가 없는 경우에만 생성
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;

-- quiz_set 테이블 생성
CREATE TABLE IF NOT EXISTS quiz_set (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_update_at_name (updated_at DESC, name),
  INDEX idx_update_at_recommended (updated_at DESC, recommended)
);

-- quiz 테이블 생성
CREATE TABLE IF NOT EXISTS quiz (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer VARCHAR(50) NOT NULL,
  play_time INT NOT NULL,
  quiz_type VARCHAR(20) NOT NULL,
  quiz_set_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_set_id) REFERENCES quiz_set(id)
);

-- 초기 데이터 삽입 (quiz_set 테이블에 데이터가 없는 경우에만)
INSERT INTO quiz_set (name, recommended)
SELECT '데모 퀴즈', true
WHERE NOT EXISTS (SELECT 1 FROM quiz_set WHERE name = '데모 퀴즈');

-- 초기 데이터 삽입 (quiz 테이블에 데이터가 없는 경우에만)
INSERT INTO quiz (question, answer, play_time, quiz_type, quiz_set_id)
SELECT q.*
FROM (
  SELECT '포도가 자기소개하면?' as question, '포도당' as answer, 30 as play_time, 'SHORT_ANSWER' as quiz_type, 1 as quiz_set_id UNION ALL
  SELECT '고양이를 싫어하는 동물은?', '미어캣', 30, 'SHORT_ANSWER', 1 UNION ALL
  SELECT '게를 냉동실에 넣으면?', '게으름', 30, 'SHORT_ANSWER', 1 UNION ALL
  SELECT '오리를 생으로 먹으면?', '회오리', 30, 'SHORT_ANSWER', 1 UNION ALL
  SELECT '네 사람이 동시에 오줌을 누면?', '포뇨', 30, 'SHORT_ANSWER', 1 UNION ALL
  SELECT '지브리가 뭘로 돈 벌게요?', '토토로', 30, 'SHORT_ANSWER', 1
) q
WHERE NOT EXISTS (SELECT 1 FROM quiz);