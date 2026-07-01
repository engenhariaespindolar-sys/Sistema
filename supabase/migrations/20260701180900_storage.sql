insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('reforma-fotos', 'reforma-fotos', false)
on conflict (id) do nothing;

create policy "documentos_select_autenticado"
  on storage.objects for select
  using (bucket_id = 'documentos' and auth.role() = 'authenticated');

create policy "documentos_insert_autenticado"
  on storage.objects for insert
  with check (bucket_id = 'documentos' and auth.role() = 'authenticated');

create policy "documentos_delete_autenticado"
  on storage.objects for delete
  using (bucket_id = 'documentos' and auth.role() = 'authenticated');

create policy "reforma_fotos_select_autenticado"
  on storage.objects for select
  using (bucket_id = 'reforma-fotos' and auth.role() = 'authenticated');

create policy "reforma_fotos_insert_autenticado"
  on storage.objects for insert
  with check (bucket_id = 'reforma-fotos' and auth.role() = 'authenticated');

create policy "reforma_fotos_delete_autenticado"
  on storage.objects for delete
  using (bucket_id = 'reforma-fotos' and auth.role() = 'authenticated');
