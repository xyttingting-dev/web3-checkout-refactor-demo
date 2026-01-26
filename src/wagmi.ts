import { http, createConfig } from 'wagmi'
import { mainnet, bsc, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [mainnet, bsc, polygon],
    connectors: [
        injected({ shimDisconnect: true }),
    ],
    transports: {
        [mainnet.id]: http(),
        [bsc.id]: http(),
        [polygon.id]: http(),
    },
})
