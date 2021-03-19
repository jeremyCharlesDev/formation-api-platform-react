<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;


class InvoiceIncrementationController {


    public function __invoke(Invoice $data, EntityManagerInterface $em)
    {
        $data->setChrono($data->getChrono() + 1);
        $em->flush();
        return $data;
    }
}