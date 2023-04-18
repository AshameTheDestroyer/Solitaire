import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

import Card, { Deck } from "../Classes/Card";
import CardElement from "../Card/CardElement";
import CardType from "../Classes/CardType";
import CardDigit from "../Classes/CardDigit";
import "../Classes/GroupByImplementaion";

import "./DeckDisplayer.scss";

export default function DeckDisplayer() {
    const [GroupingPredicate, setGroupingPredicate] = useState<(card: Card) => any>();

    useEffect(() => {
        setGroupingPredicate(
            (value: React.SetStateAction<((card: Card) => any) | undefined>) =>
                (card: Card): any => card.type);
    }, []);

    return (
        <main id="deck-displayer">
            <Navbar setGroupingPredicate={setGroupingPredicate} />
            <GroupDisplayer GroupingPredicate={GroupingPredicate} />
        </main>
    );
}

type NavbarProps = {
    setGroupingPredicate: React.Dispatch<
        React.SetStateAction<((card: Card) => any) | undefined>>;
};

function Navbar({
    setGroupingPredicate
}: NavbarProps) {
    return (
        <nav>
            <h1>Card Deck</h1>

            <section> {
                Object.getOwnPropertyNames(new Card({ digit: CardDigit.Ace, type: CardType.Heart }))
                    .map((property, i) =>
                        <button className={`grouping-button ${i == 1 ? "selected" : ""}`}
                            key={property}
                            onClick={e => {
                                const GROUPING_BUTTONS =
                                    document.querySelectorAll(".grouping-button");

                                GROUPING_BUTTONS.forEach(groupingButton =>
                                    groupingButton.classList.remove("selected"));

                                e.currentTarget.classList.add("selected");

                                setGroupingPredicate((value: React.SetStateAction<((card: Card) => any) | undefined>) =>
                                    // @ts-ignore
                                    (card: Card): any => card[property]);
                            }}>
                            {property}
                        </button>
                    )
            } </section>
        </nav>
    );
}

type GroupDisplayerProps = {
    GroupingPredicate?: (card: Card) => any;
};

function GroupDisplayer({
    GroupingPredicate,
}: GroupDisplayerProps) {
    if (!GroupingPredicate) { return (<></>); }

    return (
        <section id="group-displayer"> {
            Array.from(Deck.groupBy(GroupingPredicate))
                .map(([groupingFactor, cards], i) =>
                    <section key={i}>
                        <h1>{groupingFactor}</h1>
                        <div> {
                            cards.map((card, j) =>
                                <CardElement card={card} key={`${i}${j}`} />)
                        }
                        </div>
                    </section>
                )
        } </section>
    );
}