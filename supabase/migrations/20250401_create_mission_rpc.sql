
-- Fonction pour créer une mission sans ambiguïté de colonnes
CREATE OR REPLACE FUNCTION public.create_mission(
  mission_data JSONB,
  mission_type_value TEXT
)
RETURNS SETOF missions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_mission_id UUID;
  mission_number_value TEXT;
BEGIN
  -- Générer un nouveau numéro de mission
  mission_number_value := public.generate_mission_number(mission_type_value);
  
  -- Insérer la mission avec le type et le numéro explicitement définis
  INSERT INTO public.missions (
    mission_type,
    mission_number,
    status,
    client_id,
    distance,
    price_ht,
    price_ttc,
    vehicle_info,
    pickup_date,
    pickup_time,
    delivery_date,
    delivery_time,
    pickup_contact,
    delivery_contact,
    additional_info
  ) VALUES (
    mission_type_value,
    mission_number_value,
    mission_data->>'status',
    (mission_data->>'client_id')::UUID,
    mission_data->>'distance',
    (mission_data->>'price_ht')::NUMERIC,
    (mission_data->>'price_ttc')::NUMERIC,
    mission_data->'vehicle_info',
    (mission_data->>'pickup_date')::TIMESTAMP WITH TIME ZONE,
    mission_data->>'pickup_time',
    (mission_data->>'delivery_date')::TIMESTAMP WITH TIME ZONE,
    mission_data->>'delivery_time',
    mission_data->'pickup_contact',
    mission_data->'delivery_contact',
    mission_data->>'additional_info'
  )
  RETURNING id INTO new_mission_id;
  
  -- Retourner la mission créée
  RETURN QUERY SELECT * FROM public.missions WHERE id = new_mission_id;
END;
$$;
