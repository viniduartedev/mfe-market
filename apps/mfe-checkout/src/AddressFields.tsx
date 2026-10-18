import { useEffect, useState } from 'react';

export interface DeliveryAddress { cep: string; street: string; number: string; complement: string; district: string; city: string; state: string; }
export const emptyAddress: DeliveryAddress = { cep: '', street: '', number: '', complement: '', district: '', city: '', state: '' };
export const formatAddress = (a: DeliveryAddress) => `${a.street}, ${a.number}${a.complement ? `, ${a.complement}` : ''} — ${a.district}, ${a.city}/${a.state}, CEP ${a.cep}`;

export default function AddressFields({ value, onChange }: { value: DeliveryAddress; onChange: (value: DeliveryAddress) => void }) {
  const [lookup, setLookup] = useState({ state: 'idle', message: 'Digite o CEP para preencher o endereço automaticamente.' });
  const [retry, setRetry] = useState(0);
  const cep = value.cep.replace(/\D/g, '');
  const [found, setFound] = useState<{ cep: string; street: string; district: string; city: string; state: string } | null>(null);
  useEffect(() => {
    if (cep.length !== 8) { setLookup({ state: 'idle', message: 'Digite os 8 dígitos do CEP. Você também pode preencher o endereço manualmente.' }); return; }
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 8000);
    setLookup({ state: 'loading', message: 'Buscando endereço…' });
    fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error(response.status === 404 ? 'not-found' : 'unavailable');
      const data = await response.json();
      if (typeof data.city !== 'string' || typeof data.state !== 'string') throw new Error('unavailable');
      if (!active) return;
      setFound({ cep, street: data.street || '', district: data.neighborhood || '', city: data.city, state: data.state });
      setLookup({ state: 'success', message: 'Endereço encontrado. Confira os dados e informe o número.' });
    }).catch(error => {
      if (active) setLookup({ state: 'error', message: error.message === 'not-found' ? 'CEP não encontrado. Confira o CEP ou preencha o endereço manualmente.' : 'Não foi possível consultar o CEP. Preencha manualmente ou tente novamente.' });
    }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [cep, retry]);
  useEffect(() => {
    if (!found || found.cep !== cep) return;
    onChange({ ...value, street: found.street, district: found.district, city: found.city, state: found.state });
    setFound(null);
  }, [found, cep, value, onChange]);
  const update = (field: keyof DeliveryAddress, text: string) => onChange({ ...value, [field]: text });
  return <fieldset className="checkout-card">
    <legend>1. Endereço de entrega</legend>
    <p className="checkout-hint">Comece pelo CEP e confira os dados da sua entrega.</p>
    <div className="checkout-address-grid">
      <div className="checkout-field checkout-field-wide"><label htmlFor="delivery-cep">CEP</label><input id="delivery-cep" name="postal-code" autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" maxLength={9} pattern="[0-9]{5}-[0-9]{3}" required aria-describedby="cep-status" aria-busy={lookup.state === 'loading'} value={value.cep} onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(0, 8); update('cep', digits.replace(/^(\d{5})(\d)/, '$1-$2')); }} /><small id="cep-status" role="status" className={`checkout-cep-status checkout-cep-${lookup.state}`}>{lookup.message}</small>{lookup.state === 'error' && <button className="checkout-retry" type="button" onClick={() => setRetry(count => count + 1)}>Tentar novamente</button>}</div>
      <div className="checkout-field checkout-field-wide"><label htmlFor="delivery-street">Rua ou avenida</label><input id="delivery-street" autoComplete="address-line1" required maxLength={160} value={value.street} onChange={e => update('street', e.target.value)} placeholder="Nome do logradouro" /></div>
      <div className="checkout-field"><label htmlFor="delivery-number">Número</label><input id="delivery-number" required maxLength={20} value={value.number} onChange={e => update('number', e.target.value)} placeholder="123 ou S/N" /></div>
      <div className="checkout-field"><label htmlFor="delivery-complement">Complemento <span>opcional</span></label><input id="delivery-complement" autoComplete="address-line2" maxLength={120} value={value.complement} onChange={e => update('complement', e.target.value)} placeholder="Apto., bloco, referência" /></div>
      <div className="checkout-field checkout-field-wide"><label htmlFor="delivery-district">Bairro</label><input id="delivery-district" required maxLength={100} value={value.district} onChange={e => update('district', e.target.value)} /></div>
      <div className="checkout-field"><label htmlFor="delivery-city">Cidade</label><input id="delivery-city" autoComplete="address-level2" required maxLength={100} value={value.city} onChange={e => update('city', e.target.value)} /></div>
      <div className="checkout-field"><label htmlFor="delivery-state">Estado</label><select id="delivery-state" autoComplete="address-level1" required value={value.state} onChange={e => update('state', e.target.value)}><option value="">Selecione a UF</option>{'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ').map(uf => <option key={uf}>{uf}</option>)}</select></div>
    </div>
  </fieldset>;
}
