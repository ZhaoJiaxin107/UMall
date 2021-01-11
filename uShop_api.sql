use u_shopping;

SELECT SUM(eval_start) AS  e_star,goods_eval.goods_id,goods_name,image_url,assem_price 
		  FROM goods_eval as ge
          JOIN goods_list as gl
          ON ge.goods_id=gl.goods_id
          GROUP BY  ge.goods_id 
          ORDER BY  e_star DESC    
          LIMIT 8