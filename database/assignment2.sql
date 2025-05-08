-- task 1
INSERT INTO public.account
  (account_firstname, account_lastname, account_email, account_password)
VALUES 
  ('Tony', 'Stark', 'tonystark@starkent.com', 'Iam1ronM@n');

-- task 2
UPDATE
  public.account
SET
  account_type = 'Admin'
WHERE
  account_id = 1;

-- task 3
DELETE FROM
  public.account
WHERE
  account_id = 1;

-- task 4
UPDATE
  public.inventory
SET
  inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE
  inv_id = 10; 

-- task 5
SELECT	
	inv_make, inv_model, classification_name
FROM
	public.inventory
		JOIN
	public.classification
	ON 
	classification.classification_id = inventory.classification_id
WHERE
	classification_name = 'Sport';
	
-- task 6
UPDATE 
	public.inventory
SET
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
