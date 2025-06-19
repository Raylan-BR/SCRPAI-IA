TAXA_CAMBIO_EUR_BRL = 6.3  # mudar isso depois

def filtrar_voo(ofertas):
    voos_filtrados = []

    for oferta in ofertas:
        itinerario = oferta["itineraries"][0]
        segmentos = itinerario["segments"]
        primeira_perna = segmentos[0]
        ultima_perna = segmentos[-1]

        origem = primeira_perna["departure"]["iataCode"]
        destino = ultima_perna["arrival"]["iataCode"]
        saida = primeira_perna["departure"]["at"]
        chegada = ultima_perna["arrival"]["at"]
        duracao_total = itinerario["duration"]
        num_escalas = len(segmentos) - 1
        companhia = oferta["validatingAirlineCodes"][0]

        preco_eur = float(oferta["price"]["grandTotal"])
        preco_brl = round(preco_eur * TAXA_CAMBIO_EUR_BRL, 2)
        preco = f"R$ {preco_brl:.2f}"

        bagagens = oferta["travelerPricings"][0]["fareDetailsBySegment"][0]
        bagagem_mao = bagagens.get("includedCabinBags", {}).get("quantity", 0)
        bagagem_despachada = bagagens.get("includedCheckedBags", {}).get("quantity", 0)

        voos_filtrados.append({
            "origem": origem,
            "destino": destino,
            "saida": saida,
            "chegada": chegada,
            "duracao_total": duracao_total,
            "escalas": num_escalas,
            "companhia": companhia,
            "preco": preco,
            "bagagens": {
                "mao": bagagem_mao,
                "despachada": bagagem_despachada
            }
        })

    return voos_filtrados
