use u_shopping;

select * from goods_eval;
SELECT gl.image_url, gl.goods_name,
       SUM(ge.eval_start) as e_star
		  FROM goods_eval as ge
          JOIN goods_list as gl
          ON ge.goods_id=gl.goods_id
          GROUP BY  ge.goods_id 
          ORDER BY  e_star DESC    
          LIMIT 8;
          
          
-- 根据home表里的second_id, 去category_third三级分类里面找对应的三级分类名称, 随机拿四个
SELECT * FROM home;
SELECT * FROM category_third;
SELECT * FROM category_second;
SELECT * FROM category_first;

SELECT h.id, h.second_id, h.image_url, h.big_title, h.small_title, ct.id, ct.third_id, ct.third_name, ct.second_id 
FROM home as h
              JOIN category_third as ct
              ON h.second_id = ct.second_id
              ORDER BY rand();

select * from category_third;

SELECT third_name FROM category_third 
WHERE second_id = 295 ORDER BY rand() LIMIT 4;

SELECT * FROM goods_list;
SELECT goods_id, goods_name, image_url, goods_introduce
goods_manufacturer, goods_price, assem_price FROM goods_list WHERE second_id = 622
ORDER BY rand() LIMIT 4;


USE u_shopping;

SELECT * FROM flash_product;
SELECT * FROM flash_sale; 
SELECT * FROM goods_list;
-- 2021 01/12 12:00:00  2020 01/12 23:59:59
UPDATE flash_sale SET begin_time ='1610424000000', end_time = '1610467199000' where id = 1;
-- 2021 01/13 12:00:00  2020 01/13 23:59:59
UPDATE flash_sale SET begin_time ='1610510400000', end_time = '1610553599000'  where id = 2;

SELECT * FROM flash_sale WHERE begin_time <= '1610427121627' and end_time >='1610427121627';

SELECT * FROM flash_product;
SELECT  fp.goods_id, 
		image_url,
		goods_name, 
		goods_price, assem_price
FROM flash_product as fp
JOIN goods_list as gl
ON fp.goods_id = gl.goods_id
WHERE fp.flash_id = '8015e8de-d52d-457d-86f4-6e0c129b1ad2';

SELECT * FROM goods_style;

SELECT gl.goods_id, 
		goods_name, 
        image_url,
        goods_introduce,
        goods_manufacturer,
        goods_price,
        assem_price,
        goods_detailed_information,
        new_status,
        style_name_id,
        style_name,
        style_value_id,
        style_value
FROM goods_list AS gl
JOIN goods_style AS gs
ON gl.goods_id = gs.goods_id
WHERE gl.goods_id = '1302045135030100001';

SELECT * FROM goods_image;

SELECT * FROM goods_eval;
SELECT * FROM member;

SELECT eval_id, goods_id,
       ge.uid, style_name_id,
       style_value_id, eval_text,
       eval_star, create_time,
       username,
       head_photo_url
FROM goods_eval AS ge
JOIN member
ON ge.uid = member.uid
WHERE ge.goods_id = '1302465000000100001'
LIMIT 1, 10;

-- recommend
SELECT * FROM goods_list;
SELECT *  FROM win_location;

SELECT gl.goods_id, goods_name,
	   image_url, goods_introduce, goods_price
FROM win_location AS wl
JOIN goods_list AS gl
ON wl.goods_id = gl.goods_id
ORDER BY rand()
LIMIT 5;

SELECT * FROM category_first;
SELECT * FROM category_second WHERE first_id = 339;

SELECT * FROM category_third;
SELECT * FROM category_third WHERE second_id = 628;

-- 综合
SELECT id, goods_id, third_id,
       goods_name, image_url, goods_introduce,
	   goods_manufacturer, goods_price, assem_price, new_status
FROM goods_list WHERE third_id = 684 ORDER BY rand() LIMIT 1, 16;

-- 新品
SELECT * FROM goods_list WHERE third_id = 684 and new_status = 1 ORDER BY rand() LIMIT 1, 16;

-- 价格排序
SELECT * FROM goods_list WHERE third_id = 684 ORDER BY goods_price ASC LIMIT 1, 16;

SELECT * FROM goods_list;

SELECT * FROM search ORDER BY count DESC LIMIT 9;
SELECT * FROM search ORDER BY count DESC LIMIT 9;

SELECT * FROM member;
SELECT * FROM search;

SELECT * FROM goods_list WHERE goods_name LIKE  '%秋衣%';
SELECT COUNT(*) AS count FROM goods_list WHERE goods_name LIKE '%秋衣%';

SELECT * FROM search WHERE search_text = '44';


SELECT COUNT(*) AS count FROM goods_list WHERE third_id = 663;
SELECT * FROM search WHERE search_text = '裤子';
SELECT * FROM search; 
SELECT * FROM goods_list;
INSERT INTO search(search_text, count) VALUES('咖啡', 5);

use u_shopping;
SELECT * FROM member;


SELECT * FROM member;
SELECT * FROM search;
SELECT * FROM category_first;
SELECT * FROM category_second;
SELECT * FROM category_third;

SELECT * FROM goods_list;

SELECT count(*) AS count
               FROM goods_eval AS ge
               JOIN member
               ON ge.uid = member.uid
               WHERE ge.goods_id = '1300905183110100001';
SELECT count(*) AS count FROM goods_eval WHERE goods_id = '1300905183110100001'

