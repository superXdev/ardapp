"use client"

import { useState, useEffect } from "react"
import HeroSection from "@/components/hero-section"
import NewDramaForm from "@/components/new-drama-form"
import DramaFeed from "@/components/drama-feed"
import OwnerActions from "@/components/owner-actions"
import Pagination from "@/components/pagination"
import type { Drama, Topic } from "@/lib/types"
import { connectWallet, getCurrentWalletAddress, isContractOwner } from "@/lib/web3"

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const dramasPerPage = 5

  const [dramas, setDramas] = useState<Drama[]>([
    {
      id: "1",
      kode: "Drama Royale",
      deskripsi:
        "The biggest NFT collection launch turned into a gas war disaster when the smart contract had a critical flaw.",
      creator: "0x1234...5678",
      timestamp: Date.now() - 3600000 * 2,
      topics: [
        {
          id: "1",
          type: "link",
          content: "https://twitter.com/web3drama/status/123456789",
          pembuat: "0x1234...5678",
          waktu: Date.now() - 3600000,
        },
        {
          id: "3",
          type: "image",
          content: "/nft-drama.png",
          pembuat: "0x1234...5678",
          waktu: Date.now() - 1800000,
        },
        {
          id: "5",
          type: "link",
          content: "https://etherscan.io/tx/0x123456789abcdef",
          pembuat: "0x8765...4321",
          waktu: Date.now() - 1200000,
        },
        {
          id: "7",
          type: "link",
          content: "https://discord.gg/nftdrama",
          pembuat: "0x1234...5678",
          waktu: Date.now() - 900000,
        },
        {
          id: "9",
          type: "image",
          content: "/nft-drama-2.png",
          pembuat: "0x8765...4321",
          waktu: Date.now() - 600000,
        },
        {
          id: "11",
          type: "link",
          content: "https://medium.com/nft-drama-explained",
          pembuat: "0x1234...5678",
          waktu: Date.now() - 300000,
        },
        {
          id: "36",
          type: "link",
          content: "https://github.com/nft-project/contract-analysis",
          pembuat: "0x8765...4321",
          waktu: Date.now() - 250000,
        },
        {
          id: "37",
          type: "image",
          content: "/nft-drama-3.png",
          pembuat: "0x1234...5678",
          waktu: Date.now() - 200000,
        },
      ],
    },
    {
      id: "2",
      kode: "Rug Pull Season",
      deskripsi: "Three major projects disappeared overnight with over $10M in liquidity. Community is in shambles.",
      creator: "0x9876...5432",
      timestamp: Date.now() - 3600000 * 24,
      topics: [
        {
          id: "13",
          type: "link",
          content: "https://rugpulldetective.com/case/123",
          pembuat: "0x9876...5432",
          waktu: Date.now() - 3500000 * 24,
        },
        {
          id: "15",
          type: "image",
          content: "/rug-pull-evidence.png",
          pembuat: "0x9876...5432",
          waktu: Date.now() - 3400000 * 24,
        },
        {
          id: "17",
          type: "link",
          content: "https://twitter.com/rugpullalert/status/987654321",
          pembuat: "0x5555...6666",
          waktu: Date.now() - 3300000 * 24,
        },
        {
          id: "38",
          type: "link",
          content: "https://dune.com/queries/123456/rugpull-analysis",
          pembuat: "0x9876...5432",
          waktu: Date.now() - 3200000 * 24,
        },
        {
          id: "39",
          type: "image",
          content: "/rug-pull-evidence-2.png",
          pembuat: "0x5555...6666",
          waktu: Date.now() - 3100000 * 24,
        },
      ],
    },
    {
      id: "3",
      kode: "Governance Wars",
      deskripsi: "DAO members fighting over treasury allocation. Votes being bought by whales to push their agenda.",
      creator: "0x5678...1234",
      timestamp: Date.now() - 3600000 * 48,
      topics: [
        {
          id: "2",
          type: "link",
          content: "https://forum.dao.xyz/proposal/123",
          pembuat: "0x5678...1234",
          waktu: Date.now() - 3600000 * 36,
        },
        {
          id: "4",
          type: "image",
          content: "/dao-governance-battle.png",
          pembuat: "0x5678...1234",
          waktu: Date.now() - 3600000 * 30,
        },
        {
          id: "6",
          type: "link",
          content: "https://snapshot.org/#/dao.eth/proposal/0x987654321",
          pembuat: "0x7777...8888",
          waktu: Date.now() - 3600000 * 24,
        },
        {
          id: "8",
          type: "link",
          content: "https://twitter.com/daowhistleblower/status/567891234",
          pembuat: "0x5678...1234",
          waktu: Date.now() - 3600000 * 18,
        },
        {
          id: "10",
          type: "image",
          content: "/dao-vote-analysis.png",
          pembuat: "0x7777...8888",
          waktu: Date.now() - 3600000 * 12,
        },
        {
          id: "12",
          type: "link",
          content: "https://etherscan.io/tx/0x987654321abcdef",
          pembuat: "0x5678...1234",
          waktu: Date.now() - 3600000 * 6,
        },
        {
          id: "14",
          type: "link",
          content: "https://dune.com/queries/123456/dao-voting-analysis",
          pembuat: "0x7777...8888",
          waktu: Date.now() - 3600000 * 3,
        },
        {
          id: "16",
          type: "image",
          content: "/dao-treasury-chart.png",
          pembuat: "0x5678...1234",
          waktu: Date.now() - 3600000 * 1,
        },
        {
          id: "40",
          type: "link",
          content: "https://medium.com/dao-governance-analysis",
          pembuat: "0x7777...8888",
          waktu: Date.now() - 3600000 * 0.5,
        },
        {
          id: "41",
          type: "image",
          content: "/dao-vote-analysis-2.png",
          pembuat: "0x5678...1234",
          waktu: Date.now() - 3600000 * 0.2,
        },
      ],
    },
    {
      id: "4",
      kode: "Memecoin Madness",
      deskripsi: "A dog-themed memecoin surged 5000% after a celebrity tweet, then crashed 90% in 24 hours.",
      creator: "0x2468...1357",
      timestamp: Date.now() - 3600000 * 72,
      topics: [
        {
          id: "20",
          type: "link",
          content: "https://twitter.com/cryptoceleb/status/123456789",
          pembuat: "0x2468...1357",
          waktu: Date.now() - 3600000 * 70,
        },
        {
          id: "21",
          type: "image",
          content: "/memecoin-chart.png",
          pembuat: "0x2468...1357",
          waktu: Date.now() - 3600000 * 65,
        },
        {
          id: "42",
          type: "link",
          content: "https://dexscreener.com/memecoin-analysis",
          pembuat: "0x2468...1357",
          waktu: Date.now() - 3600000 * 60,
        },
        {
          id: "43",
          type: "image",
          content: "/memecoin-chart-2.png",
          pembuat: "0x2468...1357",
          waktu: Date.now() - 3600000 * 55,
        },
        {
          id: "44",
          type: "link",
          content: "https://etherscan.io/token/0xmemecoin",
          pembuat: "0x2468...1357",
          waktu: Date.now() - 3600000 * 50,
        },
        {
          id: "45",
          type: "link",
          content: "https://twitter.com/memecointracker/status/987654321",
          pembuat: "0x2468...1357",
          waktu: Date.now() - 3600000 * 45,
        },
      ],
    },
    {
      id: "5",
      kode: "DEX Exploit",
      deskripsi:
        "A decentralized exchange lost $50M due to a flash loan attack. Developers claim they'll reimburse users.",
      creator: "0x1357...2468",
      timestamp: Date.now() - 3600000 * 96,
      topics: [
        {
          id: "22",
          type: "link",
          content: "https://etherscan.io/tx/0xexploittransaction",
          pembuat: "0x1357...2468",
          waktu: Date.now() - 3600000 * 95,
        },
        {
          id: "23",
          type: "link",
          content: "https://twitter.com/dexproject/status/987654321",
          pembuat: "0x1357...2468",
          waktu: Date.now() - 3600000 * 90,
        },
        {
          id: "46",
          type: "image",
          content: "/dex-exploit-diagram.png",
          pembuat: "0x1357...2468",
          waktu: Date.now() - 3600000 * 85,
        },
        {
          id: "47",
          type: "link",
          content: "https://medium.com/dex-exploit-analysis",
          pembuat: "0x1357...2468",
          waktu: Date.now() - 3600000 * 80,
        },
        {
          id: "48",
          type: "link",
          content: "https://github.com/dex-project/post-mortem",
          pembuat: "0x1357...2468",
          waktu: Date.now() - 3600000 * 75,
        },
        {
          id: "49",
          type: "image",
          content: "/dex-exploit-timeline.png",
          pembuat: "0x1357...2468",
          waktu: Date.now() - 3600000 * 70,
        },
        {
          id: "50",
          type: "link",
          content: "https://twitter.com/dexproject/status/reimbursement-plan",
          pembuat: "0x1357...2468",
          waktu: Date.now() - 3600000 * 65,
        },
      ],
    },
    {
      id: "6",
      kode: "NFT Wash Trading",
      deskripsi: "Popular NFT collection exposed for wash trading to inflate prices and trading volume.",
      creator: "0x8642...9753",
      timestamp: Date.now() - 3600000 * 120,
      topics: [
        {
          id: "24",
          type: "link",
          content: "https://nftanalytics.io/wash-trading-report",
          pembuat: "0x8642...9753",
          waktu: Date.now() - 3600000 * 118,
        },
        {
          id: "25",
          type: "image",
          content: "/nft-wash-trading.png",
          pembuat: "0x8642...9753",
          waktu: Date.now() - 3600000 * 115,
        },
      ],
    },
    {
      id: "7",
      kode: "Founder Exit Scam",
      deskripsi: "Founder of hyped DeFi protocol disappeared with treasury funds after raising $20M.",
      creator: "0x9753...8642",
      timestamp: Date.now() - 3600000 * 144,
      topics: [
        {
          id: "26",
          type: "link",
          content: "https://defiwatch.com/exit-scam-alert",
          pembuat: "0x9753...8642",
          waktu: Date.now() - 3600000 * 142,
        },
      ],
    },
    {
      id: "8",
      kode: "Metaverse Land Crash",
      deskripsi: "Virtual land prices crashed 80% after major metaverse project failed to deliver on roadmap.",
      creator: "0x3579...8642",
      timestamp: Date.now() - 3600000 * 168,
      topics: [
        {
          id: "27",
          type: "image",
          content: "/metaverse-land-chart.png",
          pembuat: "0x3579...8642",
          waktu: Date.now() - 3600000 * 166,
        },
        {
          id: "28",
          type: "link",
          content: "https://metaverseinsider.com/land-crash-analysis",
          pembuat: "0x3579...8642",
          waktu: Date.now() - 3600000 * 160,
        },
      ],
    },
    {
      id: "9",
      kode: "Bridge Hack",
      deskripsi: "Cross-chain bridge exploited for $100M in what might be the largest DeFi hack of the year.",
      creator: "0x7531...9864",
      timestamp: Date.now() - 3600000 * 192,
      topics: [
        {
          id: "29",
          type: "link",
          content: "https://blocksec.com/bridge-hack-analysis",
          pembuat: "0x7531...9864",
          waktu: Date.now() - 3600000 * 190,
        },
        {
          id: "30",
          type: "image",
          content: "/bridge-hack-diagram.png",
          pembuat: "0x7531...9864",
          waktu: Date.now() - 3600000 * 185,
        },
      ],
    },
    {
      id: "10",
      kode: "Stablecoin Depeg",
      deskripsi:
        "Algorithmic stablecoin lost its peg and fell to $0.35, causing panic across the entire crypto market.",
      creator: "0x8642...7531",
      timestamp: Date.now() - 3600000 * 216,
      topics: [
        {
          id: "31",
          type: "link",
          content: "https://stablecoinwatch.com/depeg-event",
          pembuat: "0x8642...7531",
          waktu: Date.now() - 3600000 * 214,
        },
        {
          id: "32",
          type: "image",
          content: "/stablecoin-chart.png",
          pembuat: "0x8642...7531",
          waktu: Date.now() - 3600000 * 210,
        },
      ],
    },
    {
      id: "11",
      kode: "Insider Trading",
      deskripsi: "Exchange employees caught front-running new token listings, making millions in profit.",
      creator: "0x1234...9876",
      timestamp: Date.now() - 3600000 * 240,
      topics: [
        {
          id: "33",
          type: "link",
          content: "https://cryptotransparency.org/insider-trading-report",
          pembuat: "0x1234...9876",
          waktu: Date.now() - 3600000 * 238,
        },
      ],
    },
    {
      id: "12",
      kode: "Layer 2 Outage",
      deskripsi: "Major Layer 2 solution went offline for 18 hours, trapping billions in user funds.",
      creator: "0x5678...4321",
      timestamp: Date.now() - 3600000 * 264,
      topics: [
        {
          id: "34",
          type: "link",
          content: "https://layer2monitor.com/outage-report",
          pembuat: "0x5678...4321",
          waktu: Date.now() - 3600000 * 262,
        },
        {
          id: "35",
          type: "image",
          content: "/layer2-status.png",
          pembuat: "0x5678...4321",
          waktu: Date.now() - 3600000 * 260,
        },
      ],
    },
  ])

  useEffect(() => {
    const checkWallet = async () => {
      const address = await getCurrentWalletAddress()
      setWalletAddress(address)

      if (address) {
        const owner = await isContractOwner(address)
        setIsOwner(owner)
      }
    }

    checkWallet()
  }, [])

  const handleConnectWallet = async () => {
    const address = await connectWallet()
    setWalletAddress(address)

    if (address) {
      const owner = await isContractOwner(address)
      setIsOwner(owner)
    }
  }

  const tambahDramaBaru = (kode: string, deskripsi: string) => {
    if (!walletAddress) return

    const newDrama: Drama = {
      id: (dramas.length + 1).toString(),
      kode,
      deskripsi,
      creator: walletAddress,
      timestamp: Date.now(),
      topics: [],
    }

    setDramas([newDrama, ...dramas])
    // Go to first page when adding a new drama
    setCurrentPage(1)
  }

  const tambahTopikDrama = (dramaId: string, type: "link" | "image", content: string) => {
    if (!walletAddress) return

    const newTopic: Topic = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      content,
      pembuat: walletAddress,
      waktu: Date.now(),
    }

    setDramas(
      dramas.map((drama) => {
        if (drama.id === dramaId) {
          return {
            ...drama,
            topics: [...drama.topics, newTopic],
          }
        }
        return drama
      }),
    )
  }

  const hapusTopikDrama = (dramaId: string, topicId: string) => {
    setDramas(
      dramas.map((drama) => {
        if (drama.id === dramaId) {
          return {
            ...drama,
            topics: drama.topics.filter((topic) => topic.id !== topicId),
          }
        }
        return drama
      }),
    )
  }

  const hapusDrama = (dramaId: string) => {
    setDramas(dramas.filter((drama) => drama.id !== dramaId))

    // If we're on the last page and delete the last item, go to previous page
    const totalPages = Math.ceil(dramas.length / dramasPerPage)
    if (currentPage > 1 && currentPage === totalPages && dramas.length % dramasPerPage === 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const destroyContract = () => {
    if (!isOwner) return
    // In a real app, this would call the contract's self-destruct function
    alert("Contract destroyed! (This is a simulation)")
  }

  // Get current dramas for pagination
  const indexOfLastDrama = currentPage * dramasPerPage
  const indexOfFirstDrama = indexOfLastDrama - dramasPerPage
  const currentDramas = dramas.slice(indexOfFirstDrama, indexOfLastDrama)
  const totalPages = Math.ceil(dramas.length / dramasPerPage)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0b19] to-[#0d0b1f] text-white relative">
      {/* Doodle Art Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img src="/web3-doodle-bg-enhanced.png" alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <HeroSection walletAddress={walletAddress} onConnectWallet={handleConnectWallet} />

        {walletAddress && <NewDramaForm onSubmit={tambahDramaBaru} />}

        <DramaFeed
          dramas={currentDramas}
          walletAddress={walletAddress}
          onAddTopic={tambahTopikDrama}
          onDeleteTopic={hapusTopikDrama}
          onDeleteDrama={hapusDrama}
        />

        {dramas.length > dramasPerPage && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}

        {isOwner && <OwnerActions onDestroyContract={destroyContract} />}
      </div>
    </main>
  )
}
